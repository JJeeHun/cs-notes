# Spring Boot 학습 가이드

Spring Boot는 스프링 프레임워크를 사용하는 애플리케이션을 더 쉽고 빠르게 만들 수 있게 해주는 도구입니다.

## 핵심 특징
- **Auto Configuration**: 공통적으로 사용되는 설정을 자동으로 처리합니다.
- **Embedded Server**: Tomcat, Jetty 등을 내장하여 별도의 서버 설치 없이 실행 가능합니다.
- **Starter Dependencies**: 의존성 관리를 단순화합니다.

## 시작하기
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## 나의 학습 메모
- 효율적인 빈 관리를 위해 `@Component` 스캔 범위를 주의해야 함.
- 프로파일별 설정(`application-dev.yml`, `application-prod.yml`) 활용법 숙지 완료.
