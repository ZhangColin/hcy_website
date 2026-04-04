#!/bin/bash

echo "检查 robots.txt"
curl -s http://localhost:3000/robots.txt | head -10

echo "\n检查 sitemap.xml"
curl -s http://localhost:3000/sitemap.xml | head -20

echo "\nSEO 验证完成"
