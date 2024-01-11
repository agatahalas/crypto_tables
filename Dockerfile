# 1. Base image
FROM php:8.1-apache

# 4. Copy application code
COPY src/ /var/www/html/

# 5. Set working directory
WORKDIR /var/www/html/

# 6. Expose port
EXPOSE 80

# 7. Start Apache
CMD ["apache2-foreground"]
