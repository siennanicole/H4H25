import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

//converts text to MP3 file using gemini ai
async function convertTextToSpeech(text) {
    const client = new TextToSpeechClient();  
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        
        console.log('Audio written to output.mp3');
    } catch (error) {
        console.error('Error generating speech:', error);
    }
}

convertTextToSpeech("Hack for Humanity").then(() => console.log('Done!'));