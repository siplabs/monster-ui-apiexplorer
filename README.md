# Monster UI Api Explorer

#### Installation to source files:
1. Upload all folders and files to `apps/apiexplorer`
2. Upload file `lib/highlight.pack.js` to `js/vendor` directory
3. Add next strings to file `/js/main.js` after string `paths: {`
``` javascript
'hljs': 'js/vendor/highlight.pack',
```
4. Build your Monster UI with original builder (command `gulp`)
5. Register `apiexplorer` app
```bash
#sup crossbar_maintenance init_app <absolute path to apiexplorer app> <your api base url>
sup crossbar_maintenance init_app /var/www/html/monster-ui/dist/apps/apiexplorer https://site.com:8443/v2/ 
```
6. Activate the Api Explorer app in the Monster UI App Store ( `/#/apps/appstore` )

#### Installation to compiled files:
1. Upload all folders and files to `apps/apiexplorer`
2. Upload file `lib/highlight.pack.js` to `js/vendor` directory
3. Create next symbol link in root directory of Monster UI
```bash
# ln [options] <target file> [link name]
ln -s js/vendor/highlight.pack.js hljs.js
```
4. Register `apiexplorer` app
```bash
#sup crossbar_maintenance init_app <absolute path to apiexplorer app> <your api base url>
sup crossbar_maintenance init_app /var/www/html/monster-ui/dist/apps/apiexplorer https://site.com:8443/v2/ 
```
5. Activate Api Explorer app in the Monster UI App Store ( `/#/apps/appstore` )