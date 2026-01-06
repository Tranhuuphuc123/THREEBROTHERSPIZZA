package webpizza.com.vn.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Thêm dòng này xử lý bất đồng bọ cải thiện tốc độ của api call lên nextjs
public class WebappApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(WebappApplication.class, args);
	}

}
