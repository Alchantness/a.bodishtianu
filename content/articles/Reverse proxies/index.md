---
title: "Relieve pain of corporate proxies"
description: "Hate proxy - here some tips"
date: "2024-02-12"
banner:
  src: "../../images/network_proxy.jpg"
  alt: "Network proxy"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/blue-utp-cord-40XgDxBfYXM">Jordan Harrison</a></u>'
categories:
  - "Linux"
keywords:
  - "Kerberos"
  - "Proxy"
  - "Authentication"
---


## Little Introduction

When working on Linux in a Windows environment, you can find configuring the proxy very fascinating. Sometimes, basic authentication is disabled, and you need to use NTLM or Kerberos for authentication. I have some tips for you to make your life easier.
## Reverse proxy is our choise

A reverse proxy is a server that sits between client devices and a web server, forwarding client requests to the server and then returning the server's responses back to the clients. Unlike a forward proxy, which is positioned between client devices and the internet to handle requests on behalf of the clients, a reverse proxy manages the flow of requests and responses between clients and one or more backend servers. In our case, we will run this proxy locally, to authanticate us and have access to the Internet.

## Configure Kerberos locally.

First thing you need to do - be able to get Kerberos tickets and use them. There are many comprehansibe guides to do it. For minimal configartion you need valid /etc/krb5.conf file, be able to run kinit command and have valid ccache ticket. 

## CNTLM ch. 1 - classic

You can read more about cntlm here: https://cntlm.sourceforge.net/. It's nice application, with a lot of options. For example, configuring No Proxy addresses, create tunnels, use NTLM hash instead of storing password in plain text. Also it's  a cross platform tool and can be used in Windows and several Linux distros. Configuring cntlm is easy! For Debian family it goes like this:

Download cntlm:

```bash
sudo apt install cntlm
```

And confugire it: 

```bash
sudo nano /etc/cntlm.conf
```

To get NTLM hashes use this command:

```bash
sudo cntlm -u username -d domain.com -H
```

Then just restart cntlm service:

```bash
sudo systemctl restart cntlm
```

If something goes wrong, cntlm log is very

## CNTLM ch. 2- now with Kerberos

But what you need to auth with kerberos? There is the way! Get a nice fork for it. Check it out! https://github.com/biserov/cntlm-gss. 

First, download a package for your system from this github and install it. In Ubuntu:

```bash
sudo dpkg -i cntlm
```

Configure /etc/cntlm.conf. You just need to write your upstream proxy server.

Log in cntlm user and get ticket:

```bash
sudo -u cntlm /bin/bash
kinit user@DOMAIN.COM
exit
```

Restart cntlm service:
```bash
sudo systemctl restart cntlm
```
And enjoy! Export 127.0.0.1:3128 server in http_proxy env and add it in system proxy settings. You can also add it for snap and apt.
