/login
request:
{
    email:...
    password:...
}
response: 
{
    "success": ...,
    "user": {
        "email": ...,
        "id": ...,
        "password": ...,
        "avatar": ...,
        "token": ...
    }
}

/register
request:
{
    email: ...
    password: ...
    avatar: ...
}
response:
{
    "success": ...,
    "token": ...,
    "avatar": ...
}


/:userId/getweather
request:
{
    username: ...
    message: ...
}
response:
{
    "success": true,
    "status": "200",
    "message": "Email successfully sent to hulkofsky@gmail.com"
}