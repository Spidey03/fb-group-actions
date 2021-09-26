const AWS = require('aws-sdk'),
    axios = require('axios'),
    dotenv = require('dotenv');

dotenv.config();
S3_REGION = process.env.S3_REGION;

AWS.config.update({
    region: S3_REGION
});
const rekognition = new AWS.Rekognition();


async function getGenderUsingProfilePic(path) {
    const bytes = await getBase64BufferFromURL(path)
    face = await analyseFaceFromBytes(bytes);
    faceDetails = face.FaceDetails[0]
    if (faceDetails != undefined && "Gender" in faceDetails) {
        gender = faceDetails.Gender.Value
        return gender
    }
    return null
}

function analyseFaceFromBytes(bytes) {
    return rekognition
        .detectFaces({
            Image: {
                Bytes: bytes
            },
            Attributes: ['ALL']
        })
        .promise()
        .catch(error => {
            console.error('[ERROR]', error);
        });
}

function getBase64BufferFromURL(url) {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then(response => new Buffer(response.data, 'base64'))
        .catch(error => {
            console.log('[ERROR]', error);
        });
}

module.exports = {
    getGenderUsingProfilePic
}