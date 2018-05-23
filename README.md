# Token Curated Registries UI

## Installation
1. Clone this repo.
2. Install dependencies using `npm install`.
3. Configure `src/cfg.json`.
    1. Set the `"geteway"` and `"apiServer"` parameters for IPFS:
    
        ```json
        "IPFS": {
            "geatway": "https://ipfs.infura.io",
            "apiServer": "https://ipfs.infura.io:5001"
        },
        ```
    
    2. Set the Web3 fallback provider (in case of local provider type `http://localhost:7455` or any other address): 
    
         ```json
        "WEB3": {
            "http": "https://rinkeby.infura.io/API_KEY"
        },
        ```
        
    3. Set the Ethereum network id (1 – mainnet, 4 – rinkeby, * – any network). 
    
        ```json
        ...
        "network": "4",
        ...
        ```
        
    4. Set the TCR of TCRs `Registry` contract address:
    
        ```json
        "TCRofTCRs": {
            "registry": "YOUR_CONTRACT_ADDRESS"
        }
        ```
        
    By the end, you should get the following config:
    ```json
    {
      "IPFS": {
        "geatway": "https://ipfs.infura.io",
        "apiServer": "https://ipfs.infura.io:5001"
      },
      "WEB3": {
        "http": "https://rinkeby.infura.io/API_KEY"
      },
      "network": "4",
      "TCRofTCRs": {
        "registry": "YOUR_CONTRACT_ADDRESS"
      }
    }
    ```
    
4. Run `npm start` to start the development server.

## Local Ethereum Network
*ethereum-tcr-ui* is completely compatible with Ganache (TestRPC) client and it can be used as any other network.
In order to check the Ganache deploying process of TCR, please refer to [oficial TCR repo](https://github.com/skmgoldin/tcr) and [Ganache CLI repo](https://github.com/trufflesuite/ganache-cli)

## Important files

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.
* `src/cfg.json` is the core cinfiguration file.
* `src/defaultConfig.json` an example of `TCR of TCRs` IPFS config.
* `src/defaultLocalization.json` default/fallback localization file.

### Deploying
To completely install all dependencies via `npm install` you have to add an SSH key of the machine you're working on in order to pull a [ethereum-tcr-api](https://gitlab.com/ethereum-tcr/ethereum-tcr-api) package.

### License
   Copyright 2018  DApp DEV Consulting

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
