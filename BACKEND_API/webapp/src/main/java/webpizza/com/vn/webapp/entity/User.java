package webpizza.com.vn.webapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "gender")
    private Integer gender;

    @Column(name = "birthday")
    private LocalDateTime birthday;

    @Column(name = "email")
    private String email;

    //avatar
    @Column(name = "avatar")
    private String avatar;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "salary_level_id")
    private Integer levelId;

    // updatable = false: không cho phép cập nhật sau khi tạo đảm bảo tính truy vết lịch sử
    /*@CreationTimestamp:Tự động gán giá trị thời gian hiện tại (NOW()) cho trường này khi
     bản ghi được chèn (INSERT) vào CSDL.*/
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Khi INSERT: = NOW()

    /*@UpdateTimestamp:	Tự động cập nhật giá trị thời gian hiện tại (NOW()) cho trường này
    mỗi khi bản ghi được cập nhật (UPDATE).*/
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;// Khi INSERT: = NOW()

    @Column(name = "is_active")
    private Integer isActive;


    @OneToMany(mappedBy = "user")
    private List<UserHasRoles> userHasRoles;

    /****ĐOẠN NÀY BỔ SUNG LẤY DANH SÁCH VAI TRÒ ROLE CỦA USER CHO LỚP JWT/UserDetailsServiceImpl
     => bổ sung mối liên ket khoa ngoại moi qua he N-N giữa acl_user va acl_roles
     nghĩa là user qua bảng phụ là user_roles là quan hệ 1-N, tg tự role qua user_roles cũng là
     quan hệ 1-N ---> rõ ràng là user và roles là quan hệ N-N phần này viết thể hiện điếu đó
    *  + @ManytoMany: anh xa moi quan he nhieu nhieu cua table user va role thong qua bang trung gian
    *  + can khai bao bang trung gian lk moi quan he tren trong thiet ke csdl:
                *   @JoinTable(name = "acl_user_has_roles",
                        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
                        inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")))

           *
           * <=> day la cach su dung cau lenh sql select join vao api
           * <=> tuong tu cu phap JoinTable tren la cau lenh cua sql sau:
           *
                   *   select * from acl_user au
                       join acl_user_has_role auhr on auhr.user_id = au.id
                       join acl_roles ar on ar.role_id = au.id
                       where ....<đk cần truy vấn>...
    * */
    @ManyToMany
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> listRoles;

}
