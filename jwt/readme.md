# Manual JWT generation and verification
--------------------------------------

## Generate private and public key


Run these commands in a shell(you might have to install openssl).
Dont use password when prompted.


```sh
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

This should generate a public key file looking something like this:
```
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2kgvT1Gyrcu7cTMFSzcq
5G+tQ+1afQ6v8FkgemAMxiq6/OiCkNFfQ3zX44sV0xu0MUw2XrcO7qbuNnTVZqEF
t8TOLH3tYMDGrppL7d624/6KND2qnSJgd8bVe7dYxYgzLh4+s2eABkSuuMlCV+d+
gaEys1lRAZ1gBcIAVen2ofz/t7utuZ7Q3LGPlglhLAxYOmxfs2/43c3V3aYIbFnH
NEOqoHpah8Ms75uMriw8WbcP4di7FvLX1/7Pu/sXRYZkLW58HtB7roe7ts8QePYm
CkxTKq/BdzjxBeubMJxeeP0yE6F6p6xdz278gBVQ5XVrmqvstY9AORZITqgv7bog
6YdKezqCYh/CL9H7JGxJ8DiYvG2ImSkzuFXaF/iqgMGK8XQE0y7JTYzpPPNawktC
haVziLOm3jOZV/2vGKCVc4rMnerC4MRP9jc2gcfpzcUh/N/R93gtOMHFtAWyIBiQ
n6bfTw8sCJBjz7FPcR8Lk1cscRgumQmzalLOrMclbzq+vDml/jcLPEEgBIfCZXs6
//Hv+CNWzr6nDCet1zRm7JI+6oxnSflD9QJqw9lbbBkoIa8t0vRyL4MLTUBdGAJE
6bRfRYn8Sc4MYS0gA7izpsSjdydQ1u7f7dP5rmOVruI1F16UYjLzAmXz4ABsjwii
PKzjaKmh4K3XoK7zFCw6cL0CAwEAAQ==
-----END PUBLIC KEY-----
```

And a private key looking like this(no, of course Im not using this for anything... :)
```
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
```

## Publish the public key

Next, publish your public key, which is in the jwtRS256.key.pub file,
on your webserver, in https://--YOUR DOMAIN--/.well-known/jwks.json

To get the jwks.json file, use an online PEM to JWK converter, like
https://8gwifi.org/jwkconvertfunctions.jsp
(Remember, the public key is PUBLIC, so its ok :)

Your json should look like this:
(The pem converter only gives you ONE key, so paste it into the "keys" array:

```json
{
    "keys": [
        {
            "kty":"RSA",
            "e":"AQAB",
            "kid":"d839d93b-9437-4194-96f9-63420587a840",
            "n":"2kgvT1Gyrcu7cTMFSzcq5G-tQ-1afQ6v8FkgemAMxiq6_OiCkNFfQ3zX44sV0xu0MUw2XrcO7qbuNnTVZqEFt8TOLH3tYMDGrppL7d624_6KND2qnSJgd8bVe7dYxYgzLh4-s2eABkSuuMlCV-d-gaEys1lRAZ1gBcIAVen2ofz_t7utuZ7Q3LGPlglhLAxYOmxfs2_43c3V3aYIbFnHNEOqoHpah8Ms75uMriw8WbcP4di7FvLX1_7Pu_sXRYZkLW58HtB7roe7ts8QePYmCkxTKq_BdzjxBeubMJxeeP0yE6F6p6xdz278gBVQ5XVrmqvstY9AORZITqgv7bog6YdKezqCYh_CL9H7JGxJ8DiYvG2ImSkzuFXaF_iqgMGK8XQE0y7JTYzpPPNawktChaVziLOm3jOZV_2vGKCVc4rMnerC4MRP9jc2gcfpzcUh_N_R93gtOMHFtAWyIBiQn6bfTw8sCJBjz7FPcR8Lk1cscRgumQmzalLOrMclbzq-vDml_jcLPEEgBIfCZXs6__Hv-CNWzr6nDCet1zRm7JI-6oxnSflD9QJqw9lbbBkoIa8t0vRyL4MLTUBdGAJE6bRfRYn8Sc4MYS0gA7izpsSjdydQ1u7f7dP5rmOVruI1F16UYjLzAmXz4ABsjwiiPKzjaKmh4K3XoK7zFCw6cL0"
        }
    ]
}
```

E.g. https://jwt.io will try to get signing info from /.well-known/openid-configuration,
so add this file with this info:

```json
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

## Sign JWT

Use this C# code for signing a token:
(I utilized the Microsoft nuget System.IdentityModel.Tokens.Jwt)
The example is HEAVILY inspired by https://docs.hidglobal.com/auth-service/docs/buildingapps/csharp/create-and-sign-a-json-web-token--jwt--with-c--and--net.htm

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

var privateKey =
    @"-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----";

var rsa = RSA.Create();
rsa.ImportFromPem(privateKey.ToCharArray());

var rsaSecurityKey = new RsaSecurityKey(rsa);

// Generating the token
var now = DateTime.UtcNow;

var claims = new[] {
    new Claim(JwtRegisteredClaimNames.Sub, "myResponder"),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

var handler = new JwtSecurityTokenHandler();

var token = new JwtSecurityToken
(
    "https://www.tcpr.link/",
    "the_world",
    claims,
    now.AddMilliseconds(-30),
    now.AddMinutes(120),
    new SigningCredentials(rsaSecurityKey, SecurityAlgorithms.RsaSha256)
);

Console.WriteLine( handler.WriteToken(token) );
```

Something like this should be written to the console:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteVJlc3BvbmRlciIsImp0aSI6IjkxMmRjOTkwLThhZDItNDdkNS1iOWIyLWI4YjQwZGMyZGM0MSIsIm5iZiI6MTY0NjMxMzQ0MiwiZXhwIjoxODA0MDc5ODQyLCJpc3MiOiJodHRwczovL3d3dy50Y3ByLmxpbmsvIiwiYXVkIjoidGhlX3dvcmxkIn0.sDWZ3mNiQ0nkiTgddbgSClxYtUCA_ddIT7_gM8R2DjlUn7eswugYnPnn-38ds4LkoE4HACcwIcfk29KFOo_ewLWA-MREgqIP2CTg1g5uaB8CJj94eikG2fLBPpv-5nuEmHg3e0ovQlB7KwMSU-GWMtWZBSwae4cgW0I1Kxi9rqeot2zki6QXwW_XSe4o4yzyKw87vKZrKz-N60xU9Th22TBgZHSXn8GWfK6B4c3sG3s-CHzbEA0smyemFjd787MYId129UfVwi0OFXm-bW6YieLAKonmp9bKEmLhN_JM5eVHlbGS6q7X0n-9BFzeEcHffW1Pi-ZUWIOROivnS5SlOhkTEETYN6QAkEWjetRQbxpOIGnLBXmWywJmZIrhCkr5XSUdCuDBE0t7prgVb3r75bwwGfYMvANyJPAG4rS7q5s2egAIqC3u8kafL7XrjJ8uJgl_2wjuQ2hyFTskXmRgV_K5Y1KKo0sA57IzT6ggJcIUvfvPxLggAz_4eimr51Kj6XYj0YLbGCtZ7oKfaXmqR0Lw-WtsajTYUoE_uYf5tF9LMMXwvpf4UDg-K9Nmpwxfna5pvbf7VKXPe4Psr_wg9oZFn9GhfgnSPrzm38oBOCkstRXikmL_idvv8RBkYQeloiPRthVnl4SeaFy78gMZGI073XTZFTJBwFXKLnCLASI
```

## Validating the generated token

After you run the above code, you should be able to paste the generated token
into https://jwt.io and get it validated(INCLUDING the signature if you managed
to get all urls correctly changed...).

To do it in code, run this snippet:

```csharp
// See https://aka.ms/new-console-template for more information

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

var token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteVJlc3BvbmRlciIsImp0aSI6IjkxMmRjOTkwLThhZDItNDdkNS1iOWIyLWI4YjQwZGMyZGM0MSIsIm5iZiI6MTY0NjMxMzQ0MiwiZXhwIjoxODA0MDc5ODQyLCJpc3MiOiJodHRwczovL3d3dy50Y3ByLmxpbmsvIiwiYXVkIjoidGhlX3dvcmxkIn0.sDWZ3mNiQ0nkiTgddbgSClxYtUCA_ddIT7_gM8R2DjlUn7eswugYnPnn-38ds4LkoE4HACcwIcfk29KFOo_ewLWA-MREgqIP2CTg1g5uaB8CJj94eikG2fLBPpv-5nuEmHg3e0ovQlB7KwMSU-GWMtWZBSwae4cgW0I1Kxi9rqeot2zki6QXwW_XSe4o4yzyKw87vKZrKz-N60xU9Th22TBgZHSXn8GWfK6B4c3sG3s-CHzbEA0smyemFjd787MYId129UfVwi0OFXm-bW6YieLAKonmp9bKEmLhN_JM5eVHlbGS6q7X0n-9BFzeEcHffW1Pi-ZUWIOROivnS5SlOhkTEETYN6QAkEWjetRQbxpOIGnLBXmWywJmZIrhCkr5XSUdCuDBE0t7prgVb3r75bwwGfYMvANyJPAG4rS7q5s2egAIqC3u8kafL7XrjJ8uJgl_2wjuQ2hyFTskXmRgV_K5Y1KKo0sA57IzT6ggJcIUvfvPxLggAz_4eimr51Kj6XYj0YLbGCtZ7oKfaXmqR0Lw-WtsajTYUoE_uYf5tF9LMMXwvpf4UDg-K9Nmpwxfna5pvbf7VKXPe4Psr_wg9oZFn9GhfgnSPrzm38oBOCkstRXikmL_idvv8RBkYQeloiPRthVnl4SeaFy78gMZGI073XTZFTJBwFXKLnCLASI";

using var httpClient = new HttpClient();
var res = await httpClient.GetAsync("https://www.tcpr.link/.well-known/jwks.json");
var keyset = new JsonWebKeySet(await res.Content.ReadAsStringAsync());
var tokenHandler = new JwtSecurityTokenHandler();
try
{
    tokenHandler.ValidateToken(token, new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = keyset.Keys.First(),
        ValidIssuer = "https://www.tcpr.link/",
        ValidAudience = "the_world",
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true
    }, out var validatedToken);
    Console.WriteLine(validatedToken.ValidTo);
}
catch (Exception e)
{
    Console.WriteLine($"Probably invalid token: {e.Message}");
}
```


