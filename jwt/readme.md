# Manual JWT generation and verification
--------------------------------------

## Generate private and public key


Run these commands in a shell(you might have to install openssl).
Dont use password when prompted.


```sh
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Next, publish your public key, which is in the jwtRS256.key.pub file,
on your webserver, in https://--YOUR DOMAIN--/.well-known/jwks.json

Your json should look like this:
(If you have multiple keys, you might need to use the "kid" field as well)

```json
{
    "keys": [
      {
        "alg": "RS256",
        "kty": "RSA",
        "use": "sig",
        "n":"MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2kgvT1Gyrcu7cTMFSzcq5G+tQ+1afQ6v8FkgemAMxiq6/OiCkNFfQ3zX44sV0xu0MUw2XrcO7qbuNnTVZqEFt8TOLH3tYMDGrppL7d624/6KND2qnSJgd8bVe7dYxYgzLh4+s2eABkSuuMlCV+d+gaEys1lRAZ1gBcIAVen2ofz/t7utuZ7Q3LGPlglhLAxYOmxfs2/43c3V3aYIbFnHNEOqoHpah8Ms75uMriw8WbcP4di7FvLX1/7Pu/sXRYZkLW58HtB7roe7ts8QePYmCkxTKq/BdzjxBeubMJxeeP0yE6F6p6xdz278gBVQ5XVrmqvstY9AORZITqgv7bog6YdKezqCYh/CL9H7JGxJ8DiYvG2ImSkzuFXaF/iqgMGK8XQE0y7JTYzpPPNawktChaVziLOm3jOZV/2vGKCVc4rMnerC4MRP9jc2gcfpzcUh/N/R93gtOMHFtAWyIBiQn6bfTw8sCJBjz7FPcR8Lk1cscRgumQmzalLOrMclbzq+vDml/jcLPEEgBIfCZXs6//Hv+CNWzr6nDCet1zRm7JI+6oxnSflD9QJqw9lbbBkoIa8t0vRyL4MLTUBdGAJE6bRfRYn8Sc4MYS0gA7izpsSjdydQ1u7f7dP5rmOVruI1F16UYjLzAmXz4ABsjwiiPKzjaKmh4K3XoK7zFCw6cL0CAwEAAQ==",
        "e": "AQAB"
      }
    ]
  }
```

E.g. https://jwt.io will try to get signing info from /.well-known/openid-configuration,
so add this file with this info:

````json
{
   "issuer": "https://www.tcpr.link/",
   "authorization_endpoint": "https://www.tcpr.link/",
   "jwks_uri":"https://www.tcpr.link/.well-known/jwks.json",
   "response_types_supported": [
     "code", "token"
   ],
   "subject_types_supported": [
     "public", "pairwise"
   ],
   "id_token_encryption_alg_values_supported": [
     "RSA-OAEP", "RSA1_5", "RSA-OAEP-256"
   ],
   "token_endpoint": "https://www.tcpr.link/token",
   "introspection_endpoint": "https://www.tcpr.link/token",
   "revocation_endpoint": "https://www.tcpr.link/token",
}
```

