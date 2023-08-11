const sharp = require('sharp');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const transformationOptions = [{ suffix: 'w180', width: 180 }];

exports.handler = async (event) => {
    try {
        const Key = event.Records[0].s3.object.key;
        const Bucket = 'wuw-avatars';
        const path = Key.split('/')[1];
        const [filename, mimetype] = Key.split('/')[2].split('.');
        const image = await s3.getObject({ Bucket, Key }).promise();
        await Promise.all(
            transformationOptions.map(async ({ suffix, width }) => {
                try {
                    const newKey = `resize/${path}/${filename}_${suffix}.${mimetype}`;
                    const resizedImage = await sharp(image.Body).rotate().resize(width).toBuffer();
                    await s3
                        .putObject({
                            Bucket,
                            Body: resizedImage,
                            Key: newKey,
                        })
                        .promise();
                } catch (err) {
                    throw err;
                }
            }),
        );

        return {
            statusCode: 200,
            body: event,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: event,
        };
    }
};
