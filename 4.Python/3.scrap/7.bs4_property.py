from bs4 import BeautifulSoup

html_data = """
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <div class="container">
        <p>Hello, World!</p>
        <a href="https://naver.com">Naver Link</a>
        <a href="https://example.com">example Link</a>
        <img src="image.jpg" alt="Sample Image">
        <img src="image2.jpg" width="500" height="600" alt="Sample Image">
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    </div>
    <div class="footer">
        <p>Footer content</p>
    </div>
</body>
</html>
"""

soup = BeautifulSoup(html_data, "html.parser")

link_tag = soup.find("a")
link_tags = soup.find_all("a")
print(link_tag)
print(link_tags)

print(link_tag["href"])
print(link_tags[1]["href"])

img_tags = soup.find_all("img")
img_tag1 = soup.img
img_tag2 = img_tags[1]

print(img_tag2)

print(
    f"src: {img_tag1['src']}, alt: {img_tag1['alt']}, width: {img_tag1.get('width')}, height: {img_tag1.get('height')}"
)
print(
    f"src: {img_tag2['src']}, alt: {img_tag2['alt']}, width: {img_tag2.get('width')}, height: {img_tag2.get('height')}"
)
