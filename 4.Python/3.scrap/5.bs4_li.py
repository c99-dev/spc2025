from bs4 import BeautifulSoup

html_data = """
<html>
<head>
<title>Sample Page</title>
</head>
<body>
<p>Hello, World!</p>
<li></li>
<ul>
<li>Item 1</li>
<li>Item 2</li>
</ul>
</body>
</html>
"""
soup = BeautifulSoup(html_data, "html.parser")

for li in soup.find_all("li"):
    print(li.get_text())
