import urllib.request, re;
html = urllib.request.urlopen('https://unsplash.com/photos/ceSCZzjTReg').read().decode('utf-8');
print(re.search(r'https://images.unsplash.com/photo-[^\"&?]+', html).group(0))
