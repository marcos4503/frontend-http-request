# Frontend HTTP Request

Frontend HTTP Request is a library that aims to facilitate HTTP requests made with pure Javascript in the Frontend of your Websites. It was developed to make working with AJAX easier.

# How it works?

What this library does is abstract most of the code needed to make HTTP requests, reducing the amount of code needed and the repetitiveness you have when using "XmlHttpRequest" objects from Javascript.

With this library you can make HTTP requests like POST, GET or File Upload in an easy and fast way, with little code and with easy to use Callbacks so that you can easily change the UI of your Website while the Request is being made.

# How to use?

It's very easy to use Frontend HTTP Request! First you need to clone this repository. Open the downloaded file and go to the "Frontend-HTTP-Request-Source" folder then copy the "frontend-http-request.js" file and place it somewhere on your website.

The next step is to reference the library in your HTML page so that you can use the library's code within your page's Javascript code. To do this, place the HTML code below inside the `<head>` and `</head>` tags of your page. Remember to change the `src` attribute to the path where the "frontend-http-request.js" file is!

```html
<script type="text/javascript" src="../../folder/folder/frontend-http-request.js"></script>
```
 
Now comes the fun part! Make HTTP requests! To start, you need to instantiate an "HttpRequest" object. When instantiating it, you must inform the type of request (POST or GET) and the INTERNAL PATH or URL to an API. Next, if you want to add Form Fields to the request, you need to use the "AddFormField()" method of the "HttpRequest" object. Then, just use the "SetOnDoneCallback()", "SetOnProgressCallback()", "SetOnSuccessCallback()" and "SetOnErrorCallback()" methods to register the codes that will be executed in each of these Callbacks. Remembering that you are not obliged to register codes in any Callback! Currently, the library has the following Callbacks supported on ANY type of Request made...

- <b>OnDone:</b> This callback is called when the request has finished, REGARDLESS of whether the request was a success or had errors. You can use it to reset your UI after the request has finished!
- <b>OnProgress:</b> This callback returns two parameters. The parameter "currentPercent (int)" and "totalPercent (int)". With them you are able to monitor the progress (in percentage) of the request. It is called whenever there is any change in the progress of the request or upload! It is called on ANY type of request.
- <b>OnSuccess:</b> This callback is called when the request was completed and it was successful (code 200). This callback returns two parameters. The parameter "textResponse (string)" and "jsonResponse (JSON Object)". The "textResponse" parameter contains the response in text, returned by the requested API. The "jsonResponse" parameter contains the API response converted into a "JSON Object" automatically. Of course, if the API didn't return a JSON string code, this parameter will contain a `null` value.
- <b>OnError: </b> This callback is called when the request is completed and there is a connection or request error. For example error 404, 500, 503, connection error and any type of error.

Now, let's go to the examples. The example below shows how to make a GET request with this library!

```javascript
/* GET Request */

var httpRequest = new HttpRequest("GET", "https://remoteserver.com/target-api.php");
httpRequest.SetOnDoneCallback(function () {
    //On done code...
});
httpRequest.SetOnErrorCallback(function () {
    //On error code...
});
httpRequest.SetOnSuccessCallback(function (textResponse, jsonResponse) {
    //On success code...
});
httpRequest.AddFormField("car", "honda");
httpRequest.AddFormField("model", "civic");
httpRequest.StartRequest();
```

To make a POST request using this library, you can use the code below... Remembering that this library is capable of making requests to APIs that are on remote servers or on your own server.

```javascript
/* POST Request */

var httpRequest = new HttpRequest("POST", "../../target-api.php");
httpRequest.SetOnDoneCallback(function () {
    //On done code...
});
httpRequest.SetOnErrorCallback(function () {
    //On error code...
});
httpRequest.SetOnSuccessCallback(function (textResponse, jsonResponse) {
    //On success code...
});
httpRequest.AddFormField("car", "honda");
httpRequest.AddFormField("model", "civic");
httpRequest.StartRequest();
```

To upload files with this library, you must do the following... First instantiate an object of type "HttpRequest" informing the type "POST" and then informing the PATH or URL to the API that will receive the file to be sent. The rest of the code you should do normally, however, you should also use the "AddFirstFileFromInputTypeFile()" method to include the file you want to upload.

You must have a File Input somewhere on your website. To create one, you can use the HTML code below.

```html
<input id="filePickerElement" type="file" />
```

Just as an example, on the side of our PHP API we will have the following code that will receive the uploaded file...

```php
<?php

$car = $_POST["car"];
$model = $_POST["model"];

//Move the received file to the destination path...
move_uploaded_file($_FILES['uploadedFile']['tmp_name'], __DIR__ . "/received-file.tmp");

//Return the JSON response to requester...
echo('{"car":"'.$car.'", "model":"'.$model.'"}');

?>
```

When calling the "AddFirstFileFromInputTypeFile()" method, we must first inform the Field Name of the field in which we will upload the file. Next, we must inform the ID for the `<input type="file">` element that is on our page!

When you call the "StartRequest()" method, the "HttpRequest" object will automatically get the first file (zero index) selected by the user in the `<input type="file">` element. Therefore <b>YOU MUST</b> ensure that the user has selected at least <b>ONE</b> file before calling the "AddFirstFileFromInputTypeFile()" and "StartRequest()" methods! Otherwise the request will FAIL!

```javascript
/* POST + FILE UPLOAD */

var httpRequest = new HttpRequest("POST", "../../file-receiver.php");
httpRequest.SetOnDoneCallback(function () {
    //On done code...
});
httpRequest.SetOnProgressCallback(function (currentPercent, totalPercent) {
    //On progress update code...
});
httpRequest.SetOnErrorCallback(function () {
    //On error code...
});
httpRequest.SetOnSuccessCallback(function (textResponse, jsonResponse) {
    //On success code...
});
httpRequest.AddFormField("car", "honda");
httpRequest.AddFormField("model", "civic");
httpRequest.AddFirstFileFromInputTypeFile("uploadedFile", "filePickerElement");
httpRequest.StartRequest();
```

Those are the main things! Read the next topic to learn everything else! :)

# How to manage a "HttpRequest" object?

When instantiating an "HttpRequest" object you can keep a reference to the "HttpRequest" object, as you can see below...

```javascript
var httpRequest = new HttpRequest("POST", "../../target-api.php");
```

With a reference to this object, you can use the "isRequestInProgress()" and "isRequestFinished()" methods to check if the request has ended, or if the request is still in progress...

```javascript
//request started a moment ago...
var httpRequest = new HttpRequest("POST", "../../target-api.php");
//...
httpRequest.StartRequest();

//Checks...
var isInProgress = httpRequest.isRequestInProgress();
var isFinished = httpRequest.isRequestFinished();
```

If you decide to stop the request entirely, you must call method "isRequestInProgress()" to check if the request is still in progress, as it is only possible to cancel a request that is in progress. You can use the code below...

```javascript
//request started a moment ago...
var httpRequest = new HttpRequest("POST", "../../target-api.php");
//...
httpRequest.StartRequest();

//To STOP the request
if (httpRequest.isRequestInProgress() == true)
    httpRequest.StopRequest();
```

That is all!

# Do you use Backend Response Builder in PHP APIs?

Backend Response Builder is a library written for PHP that has the task of being an alternative for you who don't want (or can't) use systems like SOAP or REST, and just want to use HTTPS + PHP + GET/POST returning JSON to build your Backend APIs. This library provides a standardized, reliable, and typed way to construct your JSON responses that will be returned to Clients that consume your PHP APIs. Backend Response Builder has a set of rules to standardize the way in which JSON responses will be sent by your PHP APIs.

Because of these Backend Response Builder rules, the responses produced by PHP APIs that use it are a little different. Instead of these APIs returning just a simple JSON response to clients, APIs that use the Backend Response Builder return a response divided between a Response Header and a Response Body, where the Header is a summary of the response, and the Body is the JSON content of the API response. You can see the Backend Response Builder library <a href="https://github.com/marcos4503/backend-response-builder" target="_blank">here</a> if you want to take a look and better understand how it works.

If you intend to use Frontend Http Request to consume PHP APIs that use the Backend Response Builder, the Frontend Http Request also has a method to make your life even easier!

To check whether the Response Header returned by the API contains the header that you expect, you can use the "GetParsedJsonIfApiUsingBackendResponseBuilderHaveReturnedExpectedResponseHeaderAndRunOnErrorCallbackIfNotReturned()" method. The name is a "little" big... But it's supposed to be VERY self-explanatory!

When using this method, you must pass as the first parameter, the plain text response obtained from the API, and as a second parameter, a string containing the header that you expect the API response to have, to be considered valid. If the response returned by the API contains the expected header, then a JSON object created from the Response Body will be returned to you when calling this method. However, if the response returned by the API does not contain the expected header, this method will return `NULL` and will run any code registered in the "OnError" callback of your "HttpRequest" object.

This method will make your life easier because if the response contains the expected Response Header, you can continue processing the response normally, however, if the Response Header is not present in the API response, the "OnError" callback will be executed automatically, thus Therefore, the "OnError" callback will be executed if the request was not successful (due to no internet access, 404, 403 for example) or if the Response Header obtained does not contain the expected header. Therefore, method "GetParsedJsonIfApiUsingBackendResponseBuilderHaveReturnedExpectedResponseHeaderAndRunOnErrorCallbackIfNotReturned()" should only be used inside the code that you registered within the "OnSuccess" callback. See an example below...

```javascript
var httpRequest = new HttpRequest("GET", "https://remoteserver.com/target-api.php");
httpRequest.SetOnDoneCallback(function () {
    //On done code...
});
httpRequest.SetOnErrorCallback(function () {
    //On error code...
});
httpRequest.SetOnSuccessCallback(function (textResponse, jsonResponse) {
    //Get the parsed JSON response if the ResponseHeader is the expected and run OnError callback if is not the expected ResponseHeader...
    var jsonReply = httpRequest.GetParsedJsonIfApiUsingBackendResponseBuilderHaveReturnedExpectedResponseHeaderAndRunOnErrorCallbackIfNotReturned(textResponse, "success");

    //If don't have a JSON object, stop here, since the OnError callback was executed...
    if(jsonReply == null)
        return;

    //Executes the success code, since at this point, there is a JSON object, since the ResponseHeader contained what was expected...
});
httpRequest.AddFormField("car", "honda");
httpRequest.AddFormField("model", "civic");
httpRequest.StartRequest();
```

# Support projects like this

If you liked this Class and found it useful for your projects, please consider making a donation (if possible). This would make it even more possible for me to create and continue to maintain projects like this, but if you cannot make a donation, it is still a pleasure for you to use it! Thanks! 😀

<br>

<p align="center">
    <a href="https://www.paypal.com/donate/?hosted_button_id=MVDJY3AXLL8T2" target="_blank">
        <img src="Frontend-HTTP-Request-Source/Resources/paypal-donate.png" alt="Donate" />
    </a>
</p>

<br>

<p align="center">
Created with ❤ by Marcos Tomaz
</p>