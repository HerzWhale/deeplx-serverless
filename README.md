# DeepLX Serverless

DeepLX Free Deployment Translation API, API Compatible with [OwO-Network/DeepLX](https://github.com/OwO-Network/DeepLX), Using Serverless to Avoid Frequent Calls and Error Reporting `429`


## Usage

Request example:
``` bash
curl 'https://your-api-address/translate?token=your-token' \
--header 'Content-Type: application/json' \
--data '{
    "text": "Hello, World",
    "from": "en",
    "to": "zh"
}'
```

Response example:
```json
{
  "code": 200,
  "id": 145289000,
  "method": "Free",
  "from": "EN",
  "to": "ZH",
  "source_lang": "EN",
  "target_lang": "ZH",
  "data": "你好，世界",
  "alternatives": [
    {
      "text": "世界，你好"
    },
    {
      "text": "世界你好"
    },
    {
      "text": "您好，世界"
    }
  ]
}
```

## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLete114%2Fdeeplx-serverless&env=token&envDescription=Defining%20tokens%20is%20safer.%20Multiple%20tokens%20can%20be%20separated%20by%20commas%20in%20English&project-name=deeplx)
