let recognizer = null;
let cameraEnhancer = null;
let promiseDLRReady;

Dynamsoft.DLR.LabelRecognizer.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@2.2.31/dist/"; 
Dynamsoft.DCE.CameraEnhancer.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@3.3.5/dist/";

/** LICENSE ALERT - README 
 * To use the library, you need to first specify a license key using the API "license" as shown below.
 */
Dynamsoft.DLR.LabelRecognizer.license = "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9";
/** 
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&product=dlr&package=js to get your own trial license good for 30 days. 
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/label-recognition/programming/javascript/user-guide.html?ver=latest#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END 
 */

document.getElementById('recognizeLabel').onclick = async () => {
    try {
        await (promiseDLRReady = promiseDLRReady || (async() => {
            cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance();

            recognizer = await Dynamsoft.DLR.LabelRecognizer.createInstance();
            await recognizer.setImageSource(cameraEnhancer, {resultsHighlightBaseShapes: Dynamsoft.DCE.DrawingItem});
            await recognizer.updateRuntimeSettingsFromString("video-mrz");

            document.getElementById('div-ui-container').append(cameraEnhancer.getUIElement());
            
            // Triggered when the video frame is recognized
            recognizer.onImageRead = (results) => {
                for (let result of results) {
                    for (let lineResult of result.lineResults) {
                        console.log("Image Read: ", lineResult.text);
                    }
                }
            };

            // Triggered when a different result is recognized
            recognizer.onUniqueRead = (txt) => {
                alert(txt);
                console.log("Unique Code Found: " + txt);
            }

            // Callback to MRZ recognizing result
            recognizer.onMRZRead = async (txt, results) => {
                console.log("MRZ results: \n", txt, "\n", results);
            }

            // Callback to VIN recognizing result
            recognizer.onVINRead = (txt, results) => {
                console.log("VIN results: ",txt, results);
            }
        })());

        await recognizer.startScanning(true);
    } catch (ex) {
        let errMsg;
        if (ex.message.includes("network connection error")) {
            errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
        } else {
            errMsg = ex.message||ex;
        }
        console.error(errMsg);
        alert(errMsg);
    }
};
