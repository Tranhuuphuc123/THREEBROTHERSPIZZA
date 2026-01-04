package webpizza.com.vn.webapp.service.auoth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/*class này phục vụ công tác xác thực qua gmail
class này mọi class khác khi cần xác thưc qua gmail
đều có thể dùng không nhất thiết là một class */

@Service
public class EmailService {

    //class JavaMailSender của spring hỗ trợ xác thực qua mail
    @Autowired
    private JavaMailSender mailSender;

    /*method sendEmail để gửi email xác thực tới một user cụ thể
     + to: gửi tơi địa chỉ mail cho user nào 
     + subject: tên tiêu đề 
     + content: nội dung gửi của mail
    */
    public void SendEmail(String to, String subject, String content){
        /*1. khởi tạo biến dùng class SimpleMailMessage là class mẫu mail chuẩn: 
        to-subject-content không có đính kèm file theo khi gửi mail*/
        SimpleMailMessage message = new SimpleMailMessage();

        //xác nhận gửi email với thiết lặp: to(tới ai) - subject(tiêu đề) - content(nd gì)
        message.setTo(to);
        message.setSubject(subject);
        message.setCc(content);

        // tiến hành gửi send message đi
        mailSender.send(message);
    }
}
