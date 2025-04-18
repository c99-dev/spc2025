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
        <div id="copyright">
            <p>&copy; 2023 Sample Company</p>
        </div>
    </div>
</body>
</html>
"""

soup = BeautifulSoup(html_data, "html.parser")
link_tag = soup.select_one("a")
print(link_tag)
print(link_tag["href"])
print(link_tag.text)

link_tags = soup.select("a")
print(link_tags)

for lt in link_tags:
    print(lt.text, lt["href"])

div_container = soup.select_one("div.container")
print("div.container", div_container)


copyright = soup.select_one("#copyright")
print(copyright.text)

div_container_p = soup.select_one("div.container p")
print(div_container_p)
