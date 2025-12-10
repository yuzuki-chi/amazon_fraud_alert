FROM php:8.2-apache

# mod_rewriteを有効化
RUN a2enmod rewrite

# PDO MySQL拡張をインストール
RUN docker-php-ext-install pdo pdo_mysql

# Apache設定: AllowOverrideを有効化
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# 作業ディレクトリ
WORKDIR /var/www/html

# ポート80を公開
EXPOSE 80
