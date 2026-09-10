"use strict";(()=>{var e={};e.id=400,e.ids=[400],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84629:e=>{e.exports=import("@libsql/client")},97293:(e,a,t)=>{t.a(e,async(e,i)=>{try{t.r(a),t.d(a,{originalPathname:()=>l,patchFetch:()=>u,requestAsyncStorage:()=>E,routeModule:()=>c,serverHooks:()=>p,staticGenerationAsyncStorage:()=>T});var n=t(49303),r=t(88716),o=t(60670),s=t(81738),d=e([s]);s=(d.then?(await d)():d)[0];let c=new n.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/reset/route",pathname:"/api/reset",filename:"route",bundlePath:"app/api/reset/route"},resolvedPagePath:"C:\\Users\\Acer\\OneDrive\\Desktop\\phoobox.ai\\app\\api\\reset\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:E,staticGenerationAsyncStorage:T,serverHooks:p}=c,l="/api/reset/route";function u(){return(0,o.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:T})}i()}catch(e){i(e)}})},81738:(e,a,t)=>{t.a(e,async(e,i)=>{try{t.r(a),t.d(a,{POST:()=>s});var n=t(87070),r=t(1960),o=e([r]);async function s(){try{return await (0,r.j0)(),n.NextResponse.json({success:!0,message:"Database SQLite berhasil dikosongkan secara total!"})}catch(e){return n.NextResponse.json({success:!1,error:e.message},{status:500})}}r=(o.then?(await o)():o)[0],i()}catch(e){i(e)}})},43405:(e,a,t)=>{t.d(a,{J9:()=>i});let i=[{code:"V01",question_number:1,name:"Kualitas Hasil Foto",question_text:"Hasil foto pada Photo Box ini memiliki resolusi yang tajam, pencahayaan (lighting) yang pas, dan kualitas warna yang jernih memuaskan.",order_index:1},{code:"V02",question_number:2,name:"Harga atau Kesesuaian Harga",question_text:"Harga sewa sesi / paket foto yang ditawarkan terjangkau dan sangat sepadan dengan fasilitas serta hasil foto yang didapatkan.",order_index:2},{code:"V03",question_number:3,name:"Variasi Frame atau Template",question_text:"Photo Box ini menyediakan beragam pilihan desain frame kekinian, tema estetik, dan pilihan layout strip foto yang variatif.",order_index:3},{code:"V04",question_number:4,name:"Kualitas Properti dan Aksesoris",question_text:"Aksesoris dan properti foto yang disediakan (seperti kacamata lucu, bando, topi, dsb.) lengkap, bersih, dan menarik untuk dipakai berfoto.",order_index:4},{code:"V05",question_number:5,name:"Kemudahan Penggunaan",question_text:"Sistem dan perangkat booth (layar sentuh, navigasi menu, hitungan timer) sangat mudah dipahami dan nyaman dioperasikan secara mandiri.",order_index:5},{code:"V06",question_number:6,name:"Kecepatan Proses Pengambilan & Cetak Foto",question_text:"Proses pengambilan sesi foto efisien dan hasil cetakan foto fisik keluar dengan cepat tanpa harus menunggu antrean terlalu lama.",order_index:6},{code:"V07",question_number:7,name:"Lokasi dan Aksesibilitas",question_text:"Lokasi Photo Box ini strategis, mudah dijangkau di wilayah Samarinda (misal di pusat perbelanjaan / mall), serta memiliki area parkir yang nyaman.",order_index:7},{code:"V08",question_number:8,name:"Pelayanan & Kesigapan Staf",question_text:"Petugas / staf penjaga booth bersikap ramah, sopan, komunikatif, dan sigap membantu pengunjung saat dibutuhkan.",order_index:8},{code:"V09",question_number:9,name:"Kualitas Cetakan Fisik Foto",question_text:"Kualitas fisik kertas foto tebal, hasil cetakan tajam, warna tidak mudah luntur, dan awet untuk disimpan dalam jangka panjang.",order_index:9},{code:"V10",question_number:10,name:"Fasilitas & Kenyamanan Area",question_text:"Area Photo Box bersih, berpendingin ruangan (AC) yang sejuk, memiliki cermin rias yang memadai, serta suasana ruangan yang nyaman.",order_index:10}]},1960:(e,a,t)=>{t.a(e,async(e,i)=>{try{t.d(a,{GV:()=>l,I2:()=>g,JN:()=>d,QD:()=>m,Zn:()=>c,eK:()=>p,j0:()=>x,jO:()=>T,l1:()=>_,n:()=>E,n4:()=>u});var n=t(84629),r=t(43405),o=e([n]);n=(o.then?(await o)():o)[0];let N=(0,n.createClient)({url:"file:database.sqlite"}),b=!1;async function s(){if(b)return;await N.execute(`
    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL
    );
  `),await N.execute(`
    CREATE TABLE IF NOT EXISTS questionnaire_entries (
      id TEXT PRIMARY KEY,
      respondent_name TEXT NOT NULL,
      age INTEGER,
      photobox_name TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);try{await N.execute("ALTER TABLE questionnaire_entries ADD COLUMN age INTEGER;")}catch(e){}try{await N.execute("ALTER TABLE questionnaire_entries ADD COLUMN photobox_name TEXT;")}catch(e){}await N.execute(`
    CREATE TABLE IF NOT EXISTS questionnaire_scores (
      id TEXT PRIMARY KEY,
      entry_id TEXT NOT NULL,
      variable_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (entry_id) REFERENCES questionnaire_entries(id) ON DELETE CASCADE,
      FOREIGN KEY (variable_id) REFERENCES variables(id) ON DELETE CASCADE
    );
  `),await N.execute(`
    CREATE TABLE IF NOT EXISTS selected_top_variables (
      id TEXT PRIMARY KEY,
      variable_ids TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      confirmed_at TEXT NOT NULL
    );
  `),await N.execute(`
    CREATE TABLE IF NOT EXISTS photoboxes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `),await N.execute(`
    CREATE TABLE IF NOT EXISTS photobox_assessments (
      id TEXT PRIMARY KEY,
      photobox_id TEXT NOT NULL,
      variable_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (photobox_id) REFERENCES photoboxes(id) ON DELETE CASCADE,
      FOREIGN KEY (variable_id) REFERENCES variables(id) ON DELETE CASCADE
    );
  `);let e=await N.execute("SELECT COUNT(*) as count FROM variables"),a=Number(e.rows[0].count);if(0===a)for(let e of r.J9)await N.execute({sql:"INSERT INTO variables (id, code, name, order_index) VALUES (?, ?, ?, ?)",args:[`var-${e.code.toLowerCase()}`,e.code,e.name,e.order_index]});b=!0}async function d(){return await s(),(await N.execute("SELECT * FROM variables ORDER BY order_index ASC")).rows.map(e=>({id:String(e.id),code:String(e.code),name:String(e.name),order_index:Number(e.order_index)}))}async function u(){return await s(),(await N.execute("SELECT * FROM questionnaire_entries ORDER BY created_at DESC")).rows.map(e=>({id:String(e.id),respondent_name:String(e.respondent_name),age:e.age?Number(e.age):void 0,photobox_name:e.photobox_name?String(e.photobox_name):void 0,notes:e.notes?String(e.notes):void 0,created_at:String(e.created_at),updated_at:String(e.updated_at)}))}async function c(){return await s(),(await N.execute("SELECT * FROM questionnaire_scores")).rows.map(e=>({id:String(e.id),entry_id:String(e.entry_id),variable_id:String(e.variable_id),score:Number(e.score),created_at:String(e.created_at)}))}async function E(e,a,t,i,n){await s();let r=`entry-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,o=new Date().toISOString();for(let[s,d]of(await N.execute({sql:"INSERT INTO questionnaire_entries (id, respondent_name, age, photobox_name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",args:[r,e||"Responden Publik",t||null,i||null,n||null,o,o]}),Object.entries(a))){let e=`score-${Date.now()}-${Math.random().toString(36).substr(2,4)}`;await N.execute({sql:"INSERT INTO questionnaire_scores (id, entry_id, variable_id, score, created_at) VALUES (?, ?, ?, ?, ?)",args:[e,r,s,d,o]})}return{id:r,respondent_name:e,age:t,photobox_name:i,notes:n,created_at:o,updated_at:o}}async function T(e){await s(),await N.execute({sql:"DELETE FROM questionnaire_scores WHERE entry_id = ?",args:[e]}),await N.execute({sql:"DELETE FROM questionnaire_entries WHERE id = ?",args:[e]})}async function p(){await s();let e=await N.execute("SELECT * FROM selected_top_variables ORDER BY confirmed_at DESC LIMIT 1");if(0===e.rows.length)return null;let a=e.rows[0];return{id:String(a.id),variable_ids:JSON.parse(String(a.variable_ids)),is_active:!!a.is_active,confirmed_at:String(a.confirmed_at)}}async function l(e){await s();let a=`top5-${Date.now()}`,t=new Date().toISOString();return await N.execute({sql:"INSERT INTO selected_top_variables (id, variable_ids, is_active, confirmed_at) VALUES (?, ?, 1, ?)",args:[a,JSON.stringify(e),t]}),{id:a,variable_ids:e,is_active:!0,confirmed_at:t}}async function _(){return await s(),(await N.execute("SELECT * FROM photoboxes ORDER BY created_at ASC")).rows.map(e=>({id:String(e.id),name:String(e.name),location:String(e.location),price:Number(e.price),description:e.description?String(e.description):void 0,notes:e.notes?String(e.notes):void 0,created_at:String(e.created_at),updated_at:String(e.updated_at)}))}async function m(e){await s();let a=new Date().toISOString();if(e.id)return await N.execute({sql:"UPDATE photoboxes SET name = ?, location = ?, price = ?, description = ?, notes = ?, updated_at = ? WHERE id = ?",args:[e.name,e.location,e.price,e.description||null,e.notes||null,a,e.id]}),{id:e.id,name:e.name,location:e.location,price:e.price,description:e.description,notes:e.notes,created_at:a,updated_at:a};let t=`box-${Date.now()}-${Math.random().toString(36).substr(2,4)}`;return await N.execute({sql:"INSERT INTO photoboxes (id, name, location, price, description, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",args:[t,e.name,e.location,e.price,e.description||null,e.notes||null,a,a]}),{id:t,name:e.name,location:e.location,price:e.price,description:e.description,notes:e.notes,created_at:a,updated_at:a}}async function g(e){await s(),await N.execute({sql:"DELETE FROM photobox_assessments WHERE photobox_id = ?",args:[e]}),await N.execute({sql:"DELETE FROM photoboxes WHERE id = ?",args:[e]})}async function x(){await s(),await N.execute("DELETE FROM questionnaire_scores"),await N.execute("DELETE FROM questionnaire_entries"),await N.execute("DELETE FROM selected_top_variables"),await N.execute("DELETE FROM photobox_assessments"),await N.execute("DELETE FROM photoboxes")}i()}catch(e){i(e)}})}};var a=require("../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),i=a.X(0,[276,972],()=>t(97293));module.exports=i})();