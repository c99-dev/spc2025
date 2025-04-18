from bs4 import BeautifulSoup

html_data = """
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <div class="container">
        <p>Hello, World!</p>
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

print(soup.find("div", class_="container"))

footer = soup.find("div", class_="footer")
print(footer.find("p").get_text())
