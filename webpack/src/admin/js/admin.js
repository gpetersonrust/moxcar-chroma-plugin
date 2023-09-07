import "../scss/admin.scss"; // Importing SCSS file
import { KeyMappingManager } from "./KeyMappingManager";
import JSONConverter from "./convertJSON";
import { deleteMapKey } from "./deleteMapKey";
   
 
 

moxcar_chroma.current_page_url.match('csv-importer') &&   new JSONConverter();
if(moxcar_chroma.current_page_url.match('csv-map')) {
  const keyMappingManager = new KeyMappingManager();
 
  deleteMapKey();
}

 
 