/*
 * Frontend HTTP Request
 *
 * This class is part of the "Frontend Http Request" library created with the mission to make HTTP requests much easier on the Frontend of Websites!
*/

class HttpRequest {

    //Cache variables
    cache_requestStatus = 0; //0: ready, 1: requesting, 2: finished
    cache_preTimeOutObj;
    cache_xmlHttpReqObj;

    //Private variables
    requestType = "NONE";
    phpApiUrl = "";
    formFields = [];
    formFileName = "";
    formFileValue;

    //Request callbacks
    onDoneCallback;
    onProgressCallback;
    onSuccessCallback;
    onErrorCallback;

    //Core methods

    constructor(requestType, phpApiUrl) {
        //Build this request instance
        if (requestType == "GET" || requestType == "POST")
            this.requestType = requestType;
        this.phpApiUrl = phpApiUrl;
    }

    AddFormField(fieldName, fieldValue) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }

        //Add a field to form fields of this request
        this.formFields.push('{"fieldName":"' + fieldName + '", "fieldValue":"' + fieldValue + '"}');
    }

    AddFirstFileFromInputTypeFile(fieldName, inputTypeFileId) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }
        //If this object is GET, dont allow the addiction
        if (this.requestType == "GET") {
            console.error("It is not possible to associate a File to an HttpRequest object of type GET. Use POST instead!");
            return;
        }
        //If the input type file id is not a string, cancel this call
        if (typeof inputTypeFileId !== "string") {
            console.error("Could not get a reference to the Input Type File. You must provide the ID of an Input Type File element!");
            return;
        }

        //Get reference to the object
        var inputTypeFile = document.getElementById(inputTypeFileId);
        //Validate the reference
        if (inputTypeFile == null || inputTypeFile.tagName != "INPUT") {
            console.error("Could not get a reference to the Input Type File. You must provide the ID of an Input Type File element!");
            return;
        }

        //Add a file reference to this object
        this.formFileName = fieldName;
        //@ts-ignore
        this.formFileValue = inputTypeFile.files[0];
    }

    SetOnDoneCallback(newCallback) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }

        //Register the new callback
        this.onDoneCallback = newCallback;
    }

    SetOnProgressCallback(newCallback) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }

        //Register the new callback
        this.onProgressCallback = newCallback;
    }

    SetOnSuccessCallback(newCallback) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }

        //Register the new callback
        this.onSuccessCallback = newCallback;
    }

    SetOnErrorCallback(newCallback) {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }

        //Register the new callback
        this.onErrorCallback = newCallback;
    }

    StartRequest() {
        //If this object is not in READY state, ignores the call for this method
        if (this.cache_requestStatus != 0) {
            console.error("It is only possible to use the method while object HttpRequest is in READY state, that is, without any Request initiated!");
            return;
        }
        //If this object don't have a request type defined, cancel
        if (this.requestType == "NONE") {
            console.error("It was not possible to start the Request of object HttpRequest. No type of request was defined in the object's constructor!");
            return;
        }

        //Get reference for this HttpRequest instance
        var thisObj = this;
        //Change the status to inform that is requesting now
        thisObj.cache_requestStatus = 1;
        //Report the initial progress to callback
        if (typeof thisObj.onProgressCallback !== "undefined")
            thisObj.onProgressCallback(0.0, 100.0);

        //Set up the initial delay, before the request
        thisObj.cache_preTimeOutObj = window.setTimeout(function () {
            //Instantiate the XML Http Request object
            thisObj.cache_xmlHttpReqObj = new XMLHttpRequest();

            //Setup the OnDone, OnSuccess and OnError callbacks
            thisObj.cache_xmlHttpReqObj.onreadystatechange = function () {
                //If ERROR
                if (thisObj.cache_xmlHttpReqObj.readyState == 4 && thisObj.cache_xmlHttpReqObj.status != 200) {
                    //Inform the error to console
                    console.log("Error on execute Http Request: " + thisObj.cache_xmlHttpReqObj.status);
                    //Run the callback
                    if (typeof thisObj.onErrorCallback !== "undefined")
                        thisObj.onErrorCallback();
                }
                //If SUCCESS
                if (thisObj.cache_xmlHttpReqObj.readyState == 4 && thisObj.cache_xmlHttpReqObj.status == 200) {
                    //Try to get the response and convert it to JSON object
                    try {
                        if (typeof thisObj.onSuccessCallback !== "undefined")
                            thisObj.onSuccessCallback(thisObj.cache_xmlHttpReqObj.responseText, JSON.parse(thisObj.cache_xmlHttpReqObj.responseText));
                    } catch (e) {
                        if (typeof thisObj.onSuccessCallback !== "undefined")
                            thisObj.onSuccessCallback(thisObj.cache_xmlHttpReqObj.responseText, null);
                    }
                }
                //If DONE request
                if (thisObj.cache_xmlHttpReqObj.readyState == 4) {
                    //Run the callback
                    if (typeof thisObj.onDoneCallback !== "undefined")
                        thisObj.onDoneCallback();

                    //Change the status to inform that the request was finished
                    thisObj.cache_requestStatus = 2;
                }
            };

            //Setup the OnProgress callback
            thisObj.cache_xmlHttpReqObj.upload.addEventListener("progress", function (evnt) {
                //Get the upload info
                var totalSize = evnt.total;
                var uploadedSie = evnt.loaded;
                //Report the current progress to callback
                if (typeof thisObj.onProgressCallback !== "undefined")
                    thisObj.onProgressCallback(Math.round(((uploadedSie / totalSize) * 100.0)), 100.0);
            }, false);

            //Open and start the request
            if (thisObj.requestType == "GET") {
                if (thisObj.formFields.length == 0)
                    thisObj.cache_xmlHttpReqObj.open("GET", thisObj.phpApiUrl, true);
                if (thisObj.formFields.length != 0)
                    thisObj.cache_xmlHttpReqObj.open("GET", thisObj.phpApiUrl + "?" + thisObj.aux_GetFormFieldsConvertedToGET(), true);
                thisObj.cache_xmlHttpReqObj.send();
            }
            if (thisObj.requestType == "POST") {
                thisObj.cache_xmlHttpReqObj.open("POST", thisObj.phpApiUrl, true);
                thisObj.cache_xmlHttpReqObj.send(thisObj.aux_GetFormFieldsConvertedToPOST());
            }
        }, 1000);
    }

    isRequestInProgress() {
        //Return true if have a request in progress
        if (this.cache_requestStatus == 1)
            return true;
        if (this.cache_requestStatus != 1)
            return false;
    }

    isRequestFinished() {
        //Return true if the request was made and finished
        if (this.cache_requestStatus == 2)
            return true;
        if (this.cache_requestStatus != 2)
            return false;
    }

    StopRequest() {
        //If this object is not in REQUESTING state, ignores the call for this method
        if (this.cache_requestStatus != 1) {
            console.error("It is only possible to use the method while object HttpRequest is in REQUESTING state, that is, with a Request in progress!");
            return;
        }

        //First, remove the OnError callback, to avoid the false error calback on stop the request
        this.onErrorCallback = function () { };
        //Stop the pre delay
        window.clearTimeout(this.cache_preTimeOutObj);
        //Try to stop the request
        if (typeof this.cache_xmlHttpReqObj !== "undefined" && this.cache_xmlHttpReqObj.readyState != 4)
            this.cache_xmlHttpReqObj.abort();
        //Set the status as finished
        this.cache_requestStatus = 2;
        console.log("Http Request Stopped!");
    }

    //Auxiliar methods

    aux_GetFormFieldsConvertedToGET() {
        //Get the form fields converted to GET mode
        var uriFormData = "";

        //Build the URI formdata
        for (var i = 0; i < this.formFields.length; i++) {
            //Get the field from JSON
            var field = JSON.parse(this.formFields[i]);

            //Append to uri form data
            if (i >= 1)
                uriFormData += "&";
            uriFormData += field.fieldName + "=" + field.fieldValue;
        }

        //Return the data
        return uriFormData;
    }

    aux_GetFormFieldsConvertedToPOST() {
        //Get the form fields converted to POST mode
        var solidFormData = new FormData();

        //Build the FormData
        for (var i = 0; i < this.formFields.length; i++) {
            //Get the field from JSON
            var field = JSON.parse(this.formFields[i]);

            //Append to formdata
            solidFormData.append(field.fieldName, field.fieldValue);
        }

        //If the user has setted a file to this object, add to form data too
        if (this.formFileName != "" && typeof this.formFileValue !== "undefined")
            solidFormData.append(this.formFileName, this.formFileValue, this.formFileValue.name);

        //Return the data
        return solidFormData;
    }
}