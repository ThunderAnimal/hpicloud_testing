# NodeJS GesundheitsCloud oAuth Backend and German Emotion Tagger

A simple and small WebServer - in NodeJS - which provide these functionality:
* implementation of the crypto/auth flow at [GesundheitsCloud](https://github.com/gesundheitscloud/hc-sdk-js/blob/master/docs/sdk.md)
    * for a simple single Page - with redirecting
    * for a fat Client (like Angular) - without redirecting and using websockets
* a simple dummy-page (_views/index.html_; _public/*_) for testing and show the GesundheitsCloud functionality
* API to tag german Text after _TreeTagger_ and add german sense for each word
* API to tag a hole situational analysis - according to cbasp - and give feedback to improve the quality

## Requirements
* OS: Windows, MacOSX, Linux
* NodeJs >= 8.10.0
* Python
* Treetagger 


## Installation

### NodeJS
Just download and install: [download](https://nodejs.org/en/download/)

### Python
Just download and install: [download](https://www.python.org/downloads/)

### TreeTagger
Download and Install TreeTagger regarding the instructions: [instruction and download](http://www.cis.uni-muenchen.de/~schmid/tools/TreeTagger/)

Use the **German parameter file**!

After installation make sure that the command ``tag-german`` is available in bash/console.

__For Windows__:

Just add the _[TreeTagger]/bin_ Folder to PATH e.g.
```
set PATH=C:\TreeTagger\bin;%PATH%
```

__For Mac/Linux__:

Create a new script _tag-german_:
```
#!/bin/sh

# Set these paths appropriately

BIN="/[TreeTagger]/bin"
CMD="/[TreeTagger]/cmd"
LIB="/[TreeTagger]/lib"

OPTIONS="-token -lemma -sgml -lemma -no-unknown"

TOKENIZER=${CMD}/utf8-tokenize.perl
TAGGER=${BIN}/tree-tagger
ABBR_LIST=${LIB}/german-abbreviations-utf8
PARFILE=${LIB}/german-utf8.par
LEXFILE=${LIB}/german-lexicon-utf8.txt
FILTER=${CMD}/filter-german-tags

$TOKENIZER -a $ABBR_LIST $1 |
# external lexicon lookup
perl $CMD/lookup.perl $LEXFILE |
# tagging
$TAGGER $OPTIONS $PARFILE  | 
# error correction
$FILTER  > $2
````
Add the the Script to you preferred location (e.g. _[TreeTagger]/bin_) and add the Folder to the PATH e.g.
````
export PATH=$PATH:/tree-tagger/bin/
````


## Run Server
First Install all packages over npm:
```
npm install
```

Start the server:
```
npm start
```

Now the Server is available under: http://localhost:3000

__HINT:__ For Linux/Mac the command ``tag-german`` must be available in the same bash-Session. One solution could be:
```
export PATH=$PATH:/tree-tagger/bin/ && mpm start
```

## HTTP Endpoints

### Objects

__EmotionTagged:__
``` 
{
    word: string,
    tag: string,  //STTS - Stuttgart-Tuebingen-TagSet
    lemma: string,
    
    german_emotions: string, //ekel, freude, furcht, trauer, ueberraschung, verachtung, wut
    german_polarity_clues: {
        polarity: string, // negative, neutral, positive
        weight: number, // -1 - 1
        probability: number // 0 - 1
    },
    opm: number // -1 - 1
}
```

__EmotionResult:__
```
{
    emotion: string, //ekel, freude, furcht, trauer, ueberraschung, verachtung, wut
    polarity: string, // negative, neutral, positive
    weight: number, // -1 - 1
    senseRateOverAll: number, // 0 - 1
    senseRateInspectedList: number, // 0 - 1
}
```

### Routes

| Route:        | / |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | HTML-File (_views/index.html_) |
| Description:  | Send the Dummy-Page, to Test |

| Route:        | /auth/gctoken |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | JSON: {private_key: string, token: string} |
| Description:  | Send accesstoken and private key from current session, to check if user is logged in and to init the GesundheitsCloud SDK with the values  |

| Route:        | /auth/gckeys |
| ---    | ---  |
| Method:       | POST |
| Request:      | Body: private_key |
| Response:     | - |
| Description:  | Store private_key to session |

| Route:        | /auth/gclogin |
| ---    | ---  |
| Method:       | GET |
| Request:      | Query: public_key, websocket_id(optional) |
| Response:     | HTML-File (oAuth Login-Page) |
| Description:  | Login-Page: Redirects to GesundheitsCloud oAuth Endpoint |

| Route:        | /auth/gc/callback |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | HTML-File (oAuth Callback) |
| Description:  | only for internal use, callback from the oAuth Backend to obtain the accesstoken and redirect the client to success login page e.g. home page |

| Route:        | /auth/logout |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | - |
| Description:  | Clear session |

| Route:        | /auth/success |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | HTML-File (_views/login_success.html_) |
| Description:  | Landing Page after success login with oAuth (used for Fat-Client) |

| Route:        | /auth/error |
| ---    | ---  |
| Method:       | GET |
| Request:      | - |
| Response:     | HTML-File (_views/login_error.html_) |
| Description:  | Landing Page after failure in login with oAuth (used for Fat-Client) |

| Route:        | /api/v1/tag |
| ---    | ---  |
| Method:       | GET |
| Request:      | Query: text |
| Response:     | JSON: {tagged: [EmotionTagged], result: EmotionResult} |
| Description:  | Tagged the german emotion of a text and give a result back. Test API to see that the tagging works |

## WebSocket Connections

### Broadcast Channels
| Channel:        | connected |
| ---    | ---  |
| Data:         | {socket_id: string} |
| Description:  | Sending SocketId to Client after the Connect was successfully |

| Channel:        | login |
| ---    | ---  |
| Data:         | {login: boolean, token: string} |
| Description:  | Inform Client over Login State after oAuth and provide the accesstoken to client |


### Listen Channels
| Channel:        | connection |
| ---    | ---  |
| Data:         | socket |
| Description:  | Fired when a new Client connected to WebSocket |

| Channel:        | disconnect |
| ---    | ---  |
| Data:         | - |
| Description:  | Fired when Client disconnect from WebSocket |



