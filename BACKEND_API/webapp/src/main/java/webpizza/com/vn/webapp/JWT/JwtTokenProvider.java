package webpizza.com.vn.webapp.JWT;

/*JWT III - lop nay dung de tao ma hoa thong tin duoi dang Jwt Token(tạo ra token)
 -> chính xác hơn là tạo token & giải mã token.
 -> quy định Header và Payload khi tạo Token ở class này
 => JwtTokenProvider – đóng vai trò như một Nhà máy tạo & giải mã token
  + Nhiệm vụ:
    ++ Tạo token khi user login
    ++ Giải mã token khi user gọi API
    ++ Kiểm tra token hợp lệ

 ==> Tự kiểm tra username/password trên csdl
 nếu đúng → gọi JwtTokenProvider generateToken() khởi tạo token và  giả mã token lấy thông tin
*/


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;


@Component
public class JwtTokenProvider {
     /***
     * JWT_SECRET là KHÓA BÍ MẬT (Secret Key) do SERVER tự quy định(này ).
     * 👉 Vai trò:
     * - Dùng để ký (SIGN) và xác minh (VERIFY) JWT bằng thuật toán HMAC SHA-256 (HS256).
     * - Khóa này KHÔNG phải là hash password, KHÔNG phải bcrypt(khong khuyến nghị chuyển đỏi
     * bcrypt trên trang: "bcrypt.online").
     * 
     * 👉 Cách hoạt động:
     * - Khi gọi:
     *     signWith(key, SignatureAlgorithm.HS256)
     *   thư viện JJWT sẽ:
     *     + Lấy Header + Payload
     *     + Dùng thuật toán HS256
     *     + Kết hợp với SECRET KEY(tên key)
     *     + Sinh ra phần Signature của JWT
     * 
     * 👉 Khi client gửi token về:
     * - Server dùng CHÍNH SECRET KEY này để:
     *     + Kiểm tra chữ ký (signature)
     *     + Phát hiện token có bị sửa nội dung hay không
     *     + Xác nhận token do chính server tạo ra
     *
     * 👉 LƯU Ý QUAN TRỌNG:
     * - Secret key phải:
     *     + Được giữ kín tuyệt đối trên server
     *     + Không gửi cho client
     *     + Không lưu trong frontend
     * - Với HS256:
     *     + Key phải dài ≥ 32 bytes (256 bits)
     *
     * 👉 KHÔNG ĐƯỢC:
     * - Dùng bcrypt.online để tạo secret
     * - Dùng hash password làm secret
     *
     * 👉 Secret này:
     * - Không thay đổi khi restart server
     * - Token vẫn hợp lệ cho đến khi hết hạn (exp)
   */
     private static final String JWT_SECRET = "my-jwt-secret-key-32-bytes-long!!";

     //Tạo đối tượng Key chuẩn cho thuật toán HS256 từ chuỗi secret.
     private final Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));





    /*** định nghĩa payload  jwt token -> tao ham  ma hoa  encode(encrypt) jwt(header, payload va signature)  thanh
     * encode jwt token(ma ky tu lon xon)***
     *
     * >>note<<
     *  + password`:** **Tuyệt đối không** nên lưu mật khẩu vào Payload, vì Payload chỉ được mã
     * hóa Base64 (có thể giải mã dễ dàng), không phải mã hóa (Encrypted).
     * **`   + role` / `permission`:** Trong cấu hình hiện tại của bạn, bạn **chưa** đưa thông tin về
     **Vai trò (Roles)** vào Payload. Đây là một phương pháp bảo mật tốt hơn (Stateless), vì:
     * Bạn đang lấy **Roles** trực tiếp từ Database trong `UserDetailsServiceImpl` mỗi khi token
     * được xác thực. Điều này đảm bảo các thay đổi về quyền hạn (Roles) sẽ có hiệu lực ngay lập
     * tức, ngay cả khi token chưa hết hạn.
     *  => Nếu bạn đưa Roles vào Payload, khi người dùng bị thay đổi quyền, họ sẽ phải đợi cho đến
     * khi token hết hạn để quyền mới có hiệu lực.
     *
     *  => Collection<? extends GrantedAuthority> authorities: ý nghĩa à một cấu trúc dữ liệu 
     * cực kỳ quan trọng dùng để đại diện cho danh sách các quyền (permissions/roles) của người 
     * dùng sau khi xác thực thành công.
     *  +  Collection: Đây là giao diện (interface) cha của các loại danh sách như List
     *  hoặc Set. Nó dùng để chứa một nhóm các đối tượng.

        + <? extends GrantedAuthority>: Đây là kỹ thuật Wildcard trong Java Generics. Nó 
        có nghĩa là: "Bất kỳ kiểu dữ liệu nào là con (hoặc triển khai) của interface 
        GrantedAuthority".  Giúp mã nguồn linh hoạt hơn. Bạn có thể truyền vào một
        List<SimpleGrantedAuthority> hoặc bất kỳ lớp tùy chỉnh nào khác miễn là nó 
        thực thi GrantedAuthority.

       + GrantedAuthority: Đây là interface cốt lõi của Spring Security. Mỗi đối tượng 
       này đại diện cho một quyền cụ thể mà người dùng được cấp (ví dụ: ROLE_ADMIN, 
       OP_DELETE_USER)
     */
    public String generateToken(String username, Collection<? extends GrantedAuthority> authorities){
        //1.tao thoi han song cho token - Tạo thời gian hiện tại và thời gian hết hạn (Expiry)
        Date now = new Date();
        Date expiry = new Date(now.getTime() + 7200000); //2h ton tai(24*60*60*1000(don vi ms))

        
        /* >>>giải thích code<<<<<<
         + authorities.stream(): Chuyển danh sách các đối tượng quyền thành 
         một "dòng chảy" dữ liệu để xử lý từng cái một.
         + .map(GrantedAuthority::getAuthority): Đi vào từng đối tượng, chỉ 
         lấy ra cái tên quyền (ví dụ: lấy ra chữ "ADMIN" hoặc "CUSTOMER").
         + .collect(Collectors.joining(",")): Gom tất cả các tên quyền vừa 
         lấy được lại, nối chúng thành một chuỗi duy nhất, cách nhau bởi dấu phẩy 
         (ví dụ: "ADMIN,EMPLOYEE").
         ---> Mục đích: Tạo ra một chuỗi String gọn nhẹ để nhét vào Payload của JWT, 
        giúp Frontend dễ dàng đọc và kiểm tra role phục vụ mục đích xet role 
        ẩn hiện link url admin page trong account form khi login thành công hiện ra. */
         String roles = authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(","));
    
        /*builder la ham xay dung theo chuan Jwt
         >> giải nghĩa code<<
          + .setSubject(username): claim 1: Đặt chủ đề của token. Giá trị này thường là tên người dùng (username) hoặc ID của người dùng.
          +  .claim("roles", roles) thêm role vào payload 
          + .setIssuedAt(now): claim 2  thời gian tạo , Đặt thời điểm phát hành (token được tạo ra). Giá trị là thời gian hiện tại (now).
          + .setExpiration(expiry): claim 3 -> thời gian hết hạn, Đặt thời điểm hết hạn của token. Sau thời điểm này (expiry), token sẽ không hợp lệ.
          
          + signWith(Keys.hmacShaKeyFor(jwtSecrets.getBytes()), SignatureAlgorithm.HS256)
           ++ signWith: Thực hiện bước ký (signing) token để tạo Chữ Ký (Signature).-
           ++ Keys.hmacShaKeyFor(..): Tạo khóa mã hóa từ chuỗi bí mật (jwtSecrets) để sử dụng trong quá trình ký
           ++ SignatureAlgorithm: Chỉ định thuật toán mã hóa được sử dụng để ký là HMAC using SHA-256(là thuật toán HS256
           ở phần header trong cấu trúc jwt token(header - payload - signature á))

         + .compact(); //Hoàn tất việc xây dựng và chuyển JWT thành một chuỗi nén, mã hóa Base64URL, có định dạng: Header.Payload.Signature.
        */
        // 2. Định nghĩa các Claims (Payload)
        return Jwts.builder()
                .setSubject(username)
                .claim("role", roles) // Thêm dòng này là xong! Role sẽ nằm trong Payload
                .setIssuedAt(now)
                .setExpiration(expiry)
                //.signWith(Keys.hmacShaKeyFor(jwtSecrets.getBytes()), SignatureAlgorithm.HS256) // phàn này chỉ định thuật toán dùng trong jwt token ở header
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }



    /*tao ham giai ma decode(decrypt) jwt token(ma ky tu lon xon) ngc lai thanh cac decode jwt token ***
     >> giải thích code<<
      + Jwts.parserBuilder(): Bắt đầu quá trình xây dựng đối tượng Parser (bộ giải mã) của thư viện JJWT.
      + setSigningKey(jwtSecrets.getBytes()): Đặt Khóa Bí Mật (Secret Key). Khóa này được sử dụng để xác
      minh chữ ký (Signature) của Token. Nếu chữ ký không hợp lệ (token bị giả mạo hoặc thay đổi), bước
      tiếp theo sẽ thất bại.
      + .build(): Hoàn tất việc cấu hình bộ giải mã, tạo ra đối tượng JwtParser.
      + .parseClaimsJws(token): Thực hiện giải mã (parsing) và xác minh (verification):
        ++ 1. Giải mã Header và Payload.
        ++ 2. Dùng khóa bí mật đã thiết lập để kiểm tra chữ ký (Signature)
        ++ 3. Kiểm tra xem Token còn hiệu lực không (Expiration Claim).
        --> Nếu Token không hợp lệ (hết hạn, chữ ký sai), nó sẽ ném ra ngoại lệ (Exception).

      + .getBody(): Lấy ra phần Payload (thân) của Token, chứa các thông tin Claim (yêu cầu) đã được
       mã hóa, Trả về đối tượng Claims
      + .getSubject(): Trích xuất giá trị của Claim Subject (sub) từ Payload. Giá trị này chính là
       Username mà bạn đã đặt khi tạo Token --> Trả về chuỗi username.
    */
    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    /****ham kiem tra jwt co hop le hay khong****
     public boolean isTokenValid(String token, UserDetails userDetails){
     * + UserDetails: giup luu tru thong tin xac thuc -> xac thuc thnh cong tt se dc luu vao
     * */
    public boolean isTokenValid(String token, UserDetails userDetails){
        return extractUsername(token).equals(userDetails.getUsername());
    }
}
