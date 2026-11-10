import React, { useMemo, useRef, useState } from "react";
import { Copy, Download, Dices, Sparkles, Check, Printer, Ruler, FileText, ChevronDown, Lightbulb, MousePointerClick, Upload, X, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle, GitCompareArrows, RefreshCw, Loader2 } from "lucide-react";

const mediaTypes = ["Flyer","Brosur Lipat 3","Poster","Spanduk","Banner","Billboard","X-Banner","Roll Up Banner","Neon Box / Signage","Stiker","Kartu Nama","Katalog","Kemasan / Packaging","Media Sosial Cetak"];
const presets: Record<string,string[]> = {
  "Flyer": ["A5 — 14,8 × 21 cm","A4 — 21 × 29,7 cm","DL — 9,9 × 21 cm"],
  "Brosur Lipat 3": ["A4 lipat 3 — 21 × 29,7 cm","DL lipat 3 — 9,9 × 21 cm","A5 lipat 3 — 14,8 × 21 cm"],
  "Poster": ["A3 — 29,7 × 42 cm","A2 — 42 × 59,4 cm","50 × 70 cm"],
  "Spanduk": ["3 × 1 m","4 × 1 m","5 × 1 m","6 × 1 m"],
  "Banner": ["2 × 1 m","3 × 1 m","4 × 1 m","1 × 1 m"],
  "Billboard": ["6 × 3 m","8 × 4 m","10 × 5 m","12 × 6 m"],
  "X-Banner": ["60 × 160 cm","80 × 180 cm","60 × 180 cm"],
  "Roll Up Banner": ["85 × 200 cm","100 × 200 cm","120 × 200 cm"],
  "Neon Box / Signage": ["100 × 50 cm","150 × 60 cm","200 × 80 cm"],
  "Stiker": ["5 × 5 cm","7 × 10 cm","10 × 15 cm"],
  "Kartu Nama": ["9 × 5,5 cm","8,5 × 5,5 cm","9 × 5 cm"],
  "Katalog": ["A4 — 21 × 29,7 cm","A5 — 14,8 × 21 cm","21 × 21 cm"],
  "Kemasan / Packaging": ["10 × 15 cm","15 × 20 cm","20 × 30 cm"],
  "Media Sosial Cetak": ["A4 — 21 × 29,7 cm","30 × 40 cm","A3 — 29,7 × 42 cm"],
};
const goals = ["Jualan / Penjualan","Branding","Grand Opening","Promo Diskon","Event","Informasi"];
const styles = ["Modern Elegan Natural Profesional","Modern Bold","Elegan Premium","Ceria & Colorful","Retro Classic","Mewah / Luxury"];
const units = ["cm","mm","m","inch","px"];
const orientations = ["Portrait","Landscape","Kotak"];
const dpis = ["72","150","300","Custom"];
const formats = ["JPG","PNG","PDF Print","AI / PSD (editable)"];
const fileTargets = ["Bebas","< 2 MB","< 5 MB","< 10 MB","Kualitas Maksimal (Print)"];
const qualities = ["Standar","High","Ultra Print"];

type FormState = {
  media:string; brand:string; product:string; goal:string; audience:string; headline:string; promo:string;
  style:string; colorText:string; colors:{hex:string;name:string}[];
  sizeMode:"Preset"|"Custom"; preset:string; width:string; height:string; unit:string; orientation:string;
  bleed:string; safeArea:boolean; dpi:string; customDpi:string; format:string; colorMode:string; target:string; quality:string;
};

const initial: FormState = {
  media:"Flyer", brand:"", product:"", goal:"Jualan / Penjualan", audience:"", headline:"", promo:"",
  style:"Modern Elegan Natural Profesional", colorText:"Merah + Krem",
  colors:[{hex:"#2563EB",name:"Biru"},{hex:"#0F172A",name:"Navy"},{hex:"#F8FAFC",name:"Putih"}],
  sizeMode:"Preset", preset:presets["Flyer"][0], width:"21", height:"29.7", unit:"cm", orientation:"Portrait",
  bleed:"3", safeArea:true, dpi:"300", customDpi:"300", format:"PDF Print", colorMode:"CMYK (Cetak)", target:"Kualitas Maksimal (Print)", quality:"Ultra Print",
};

const examples: {title:string;desc:string;patch:Partial<FormState>}[] = [
  {title:"Contoh: Flyer Cafe — Modern Elegan",desc:"Klik untuk lihat langsung nuansa modern, elegan, natural, profesional",patch:{media:"Flyer",brand:"Kala Coffee",product:"Kopi Susu Gula Aren & Croissant Butter — Cafe cozy untuk kerja dan santai",goal:"Jualan / Penjualan",audience:"Anak muda & pekerja usia 20-35 tahun yang suka cafe estetik",headline:"Ngopi Tenang, Kerja Jadi Nyaman.",promo:"Promo Opening: Beli 1 Gratis 1 Kopi Susu Gula Aren • Setiap hari 08.00 - 22.00 • Jl. Kenanga No. 12 • IG @kalacoffee",style:"Modern Elegan Natural Profesional",colorText:"Krem hangat, coklat muda, sage green — natural dan lembut",colors:[{hex:"#F5EFE6",name:"Krem Hangat"},{hex:"#C8A97E",name:"Coklat Muda"},{hex:"#A8B8A0",name:"Sage Green"}],sizeMode:"Preset",preset:"A5 — 14,8 × 21 cm",orientation:"Portrait",dpi:"300",format:"JPG",colorMode:"CMYK (Cetak)",quality:"High",target:"Kualitas Maksimal (Print)"}},
  {title:"Flyer Kuliner",desc:"Menu andalan, harga jelas, dan CTA WhatsApp yang mudah dibaca.",patch:{media:"Flyer",brand:"Warung Sunda Asli",product:"Nasi Liwet + Ayam Goreng dan paket hemat keluarga",goal:"Jualan / Penjualan",audience:"Keluarga usia 20–50 tahun",headline:"Nasi Liwet Hangat, Rasa Rumahan",promo:"Diskon 20% untuk pembelian pertama. Pesan via WA 0812-0000-0000 • IG @warungsundaasli",style:"Ceria & Colorful",colorText:"Merah + Krem",colors:[{hex:"#DC2626",name:"Merah"},{hex:"#FEF3C7",name:"Krem"},{hex:"#0F172A",name:"Hitam"}],sizeMode:"Preset",preset:"A5 — 14,8 × 21 cm",orientation:"Portrait"}},
  {title:"Spanduk Grand Opening",desc:"Dibaca dari jauh dengan tanggal, alamat, dan penawaran pembuka.",patch:{media:"Spanduk",brand:"Kopi Kita",product:"Kedai kopi dan roti panggang",goal:"Grand Opening",audience:"Pengendara dan warga sekitar",headline:"Kopi Kita Telah Dibuka!",promo:"Gratis 1 kopi untuk 100 pengunjung pertama. Jl. Merdeka No. 12 • Buka 07.00–21.00",style:"Modern Bold",colorText:"Navy + Kuning",colors:[{hex:"#0F172A",name:"Navy"},{hex:"#FACC15",name:"Kuning"},{hex:"#FFFFFF",name:"Putih"}],sizeMode:"Preset",preset:"4 × 1 m",orientation:"Landscape",dpi:"150",format:"JPG",quality:"High"}},
  {title:"Billboard Properti",desc:"Satu pesan utama yang kuat, tanpa detail kecil yang hilang di jalan.",patch:{media:"Billboard",brand:"Griya Asri",product:"Perumahan dengan taman, keamanan 24 jam, dan akses mudah",goal:"Branding",audience:"Keluarga yang mencari rumah pertama",headline:"Rumah Pertama, Nyaman Seumur Hidup",promo:"Mulai Rp 450 juta • Hubungi 0812-0000-0000 • griyaasri.id",style:"Elegan Premium",colorText:"Hijau Tua + Emas + Putih",colors:[{hex:"#14532D",name:"Hijau Tua"},{hex:"#D4AF37",name:"Emas"},{hex:"#FFFFFF",name:"Putih"}],sizeMode:"Preset",preset:"8 × 4 m",orientation:"Landscape",dpi:"150",format:"JPG",colorMode:"CMYK (Cetak)",quality:"Ultra Print"}},
];

function slug(s:string){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"media-cetak"}

type UploadedMaterial = { id:string; name:string; size:number; type:string; preview:string; url:string; originalSize?:number; originalUrl?:string; compressed?:boolean; quality?:number };
type SizeLimitMode = "Middle" | "High";
type UploadNotice = { kind:"error"|"success"|"warning"; text:string; fileName?:string; showDocActions?:boolean } | null;
const MB = 1024 * 1024;
const TOTAL_LIMIT = 50 * MB;
const PER_FILE_LIMITS: Record<SizeLimitMode, number> = { Middle: 5 * MB, High: 25 * MB };
const PER_FILE_LABELS: Record<SizeLimitMode, string> = { Middle: "Middle 5MB", High: "High 25MB" };

function isCompressibleImage(file:{type:string;name:string}){
  const t=(file.type||"").toLowerCase();
  return t==="image/jpeg" || t==="image/png" || t==="image/webp" || /\.(jpe?g|png|webp)$/i.test(file.name);
}
function loadImageBitmap(file:Blob):Promise<HTMLImageElement>{
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{ URL.revokeObjectURL(url); resolve(img); };
    img.onerror=()=>{ URL.revokeObjectURL(url); reject(new Error("Gambar tidak bisa dibaca.")); };
    img.src=url;
  });
}
function canvasToBlob(canvas:HTMLCanvasElement,type:string,quality:number):Promise<Blob|null>{
  return new Promise((resolve)=>canvas.toBlob((b)=>resolve(b),type,quality));
}
async function compressImageBlob(source:Blob,originalName:string,targetBytes:number,opts?:{qualities?:number[];maxDim?:number}):Promise<{blob:Blob;quality:number}|null>{
  try{
    const img=await loadImageBitmap(source);
    const maxDim=opts?.maxDim ?? 3000;
    const scale=Math.min(1,maxDim/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));
    const w=Math.max(1,Math.round((img.naturalWidth||img.width)*scale));
    const h=Math.max(1,Math.round((img.naturalHeight||img.height)*scale));
    const canvas=document.createElement("canvas"); canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext("2d"); if(!ctx) return null;
    const qualities=opts?.qualities ?? [0.9,0.7,0.5];
    const isPng=/\.png$/i.test(originalName) || source.type==="image/png";
    let best:Blob|null=null; let bestQuality=qualities[qualities.length-1];
    // Draw once (white background keeps JPEG output clean for transparent images).
    ctx.fillStyle="#FFFFFF"; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
    if(isPng){
      const pngBlob=await canvasToBlob(canvas,"image/png",1);
      if(pngBlob && pngBlob.size<=targetBytes) return {blob:pngBlob,quality:0.9};
      if(pngBlob && (!best || pngBlob.size<best.size)){ best=pngBlob; bestQuality=0.9; }
    }
    for(const q of qualities){
      const outType=isPng?"image/jpeg":(source.type==="image/webp"?"image/webp":"image/jpeg");
      const blob=await canvasToBlob(canvas,outType,q);
      if(!blob) continue;
      if(!best || blob.size<best.size){ best=blob; bestQuality=q; }
      if(blob.size<=targetBytes) return {blob,quality:q};
    }
    if(best) return {blob:best,quality:bestQuality};
    return null;
  }catch{ return null; }
}

function formatFileSize(bytes:number){
  if(!bytes) return "0 KB";
  if(bytes < 1024) return `${bytes} B`;
  if(bytes < 1024*1024) return `${(bytes/1024).toFixed(1).replace(/\.0$/,"")} KB`;
  return `${(bytes/(1024*1024)).toFixed(1).replace(/\.0$/,"")} MB`;
}
function formatTotalMB(bytes:number){ return `${(bytes / MB).toFixed(1)} MB`; }
function fileKind(m:UploadedMaterial){
  if(m.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(m.name)) return "image";
  if(m.type==="application/pdf" || /\.pdf$/i.test(m.name)) return "pdf";
  return "doc";
}

export default function App(){
  const [form,setForm]=useState<FormState>(initial);
  const [lang,setLang]=useState<"ID"|"EN">("ID");
  const [result,setResult]=useState("");
  const [copied,setCopied]=useState(false);
  const [status,setStatus]=useState("Lengkapi form, lalu klik Generate Prompt.");
  const [generated,setGenerated]=useState(false);
  const [activeExample,setActiveExample]=useState<string|null>(null);
  const [materials,setMaterials]=useState<UploadedMaterial[]>([]);
  const [dragOver,setDragOver]=useState(false);
  const [sizeLimit,setSizeLimit]=useState<SizeLimitMode>("High");
  const [uploadNotice,setUploadNotice]=useState<UploadNotice>(null);
  const [previewIndex,setPreviewIndex]=useState<number|null>(null);
  const [pdfFallback,setPdfFallback]=useState(false);
  const [autoCompress,setAutoCompress]=useState(true);
  const [compressing,setCompressing]=useState(false);
  const [compareId,setCompareId]=useState<string|null>(null);
  const [compareTab,setCompareTab]=useState<"original"|"compressed">("compressed");
  const [confirmRecompressId,setConfirmRecompressId]=useState<string|null>(null);
  const [recompressingId,setRecompressingId]=useState<string|null>(null);
  const resultRef=useRef<HTMLTextAreaElement>(null);
  const fileInputRef=useRef<HTMLInputElement>(null);

  const perFileLimit = PER_FILE_LIMITS[sizeLimit];
  const perFileLabel = sizeLimit === "Middle" ? "5 MB" : "25 MB";
  const totalUsed = materials.reduce((sum,m)=>sum+m.size,0);
  const totalPercent = Math.min(100, Math.round((totalUsed / TOTAL_LIMIT) * 100));
  const overLimitCount = materials.filter(m=>m.size > perFileLimit).length;
  const previewMaterial = previewIndex !== null ? materials[previewIndex] : null;
  const compareMaterial = compareId ? materials.find(m=>m.id===compareId) ?? null : null;

  const changeSizeLimit=(mode:SizeLimitMode)=>{
    setSizeLimit(mode);
    const limit = PER_FILE_LIMITS[mode];
    const over = materials.filter(m=>m.size > limit).length;
    if(mode==="Middle" && over>0){
      setUploadNotice({kind:"warning", text:`Ada ${over} file melebihi batas Middle. File tetap tersimpan dan ditandai warning di bawah.`});
    } else {
      setUploadNotice({kind:"success", text:`Batas ukuran diubah ke ${PER_FILE_LABELS[mode]} / file.`});
    }
  };

  const addMaterials=async(incoming:FileList|File[])=>{
    const files=Array.from(incoming);
    if(!files.length) return;
    const room=Math.max(0,10-materials.length);
    if(room===0){ setUploadNotice({kind:"error", text:"Maksimal 10 file materi. Hapus salah satu file sebelum menambah yang baru."}); setStatus("Maksimal 10 file materi. Hapus salah satu file sebelum menambah yang baru."); return; }
    const errors:string[]=[];
    const warnings:string[]=[];
    const successes:string[]=[];
    const acceptedFiles:File[]=[];
    const acceptedMaterials:UploadedMaterial[]=[];
    let runningTotal=totalUsed;
    const needsCompress=files.slice(0,room).some(f=>f.size>perFileLimit && isCompressibleImage(f) && autoCompress);
    if(needsCompress){ setCompressing(true); setStatus("Mengompres gambar agar masuk batas…"); }
    try{
      for(const file of files.slice(0,room)){
        if(file.size > perFileLimit){
          if(isCompressibleImage(file) && autoCompress){
            const result=await compressImageBlob(file,file.name,perFileLimit);
            if(result && result.blob.size < file.size){
              const compressedBlob=result.blob;
              if(runningTotal + compressedBlob.size > TOTAL_LIMIT){ errors.push(`Total file melebihi 50 MB setelah mengompres ${file.name}.`); continue; }
              if(compressedBlob.size > perFileLimit){
                errors.push(`File ${file.name} masih melebihi batas ${perFileLabel} setelah dikompres ke ${formatFileSize(compressedBlob.size)}. Pilih mode High atau kompres manual.`);
                continue;
              }
              const originalUrl=URL.createObjectURL(file);
              const url=URL.createObjectURL(compressedBlob);
              const qualityPct=Math.round(result.quality*100);
              acceptedMaterials.push({ id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name:file.name, size:compressedBlob.size, type:compressedBlob.type||file.type, preview:url, url, originalSize:file.size, originalUrl, compressed:true, quality:qualityPct });
              runningTotal += compressedBlob.size;
              successes.push(`File ${file.name} dikompres otomatis dari ${formatFileSize(file.size)} ke ${formatFileSize(compressedBlob.size)} agar masuk batas ${sizeLimit}.`);
              continue;
            }
            errors.push(`File ${file.name} gagal dikompres otomatis. Silakan kompres manual atau pilih mode High.`);
            continue;
          }
          if(isCompressibleImage(file) && !autoCompress){
            errors.push(`File ${file.name} melebihi batas ${perFileLabel}. Aktifkan kompres otomatis atau pilih mode High.`);
            continue;
          }
          // PDF / DOC / TXT tidak bisa dikompres otomatis di browser.
          warnings.push(`File ${file.name} melebihi batas dan tidak bisa dikompres otomatis. Silakan kompres manual, pilih mode High, atau ganti file.`);
          continue;
        }
        if(runningTotal + file.size > TOTAL_LIMIT){ errors.push("Total file melebihi 50 MB."); continue; }
        acceptedFiles.push(file); runningTotal += file.size;
      }
    } finally { setCompressing(false); }
    if(files.length>room) errors.push("Maksimal 10 file materi.");
    const next:UploadedMaterial[]=[...acceptedMaterials, ...acceptedFiles.map((file,i)=>{ const url=URL.createObjectURL(file); return { id:`${Date.now()}-${i}-${Math.random().toString(36).slice(2,8)}`, name:file.name, size:file.size, type:file.type, preview:file.type.startsWith("image/")?url:"", url }; })];
    if(next.length) setMaterials(prev=>[...prev,...next]);
    if(warnings.length){
      const firstOver=files.find(f=>f.size>perFileLimit && !isCompressibleImage(f));
      setUploadNotice({kind:"warning", text:warnings.join(" "), fileName:firstOver?.name, showDocActions:true});
      setStatus(warnings.join(" "));
    } else if(errors.length){
      setUploadNotice({kind:"error", text:errors.join(" ")});
      setStatus(errors.join(" "));
    } else if(successes.length){
      setUploadNotice({kind:"success", text:successes.join(" ")});
      setStatus(successes.join(" "));
    } else if(next.length){
      setUploadNotice({kind:"success", text:"File ditambahkan."});
      setStatus(`${next.length} file materi ditambahkan. File hanya diproses di browser ini.`);
    }
  };
  const revokeMaterial=(m:UploadedMaterial)=>{ if(m.preview) URL.revokeObjectURL(m.preview); if(m.url && m.url!==m.preview) URL.revokeObjectURL(m.url); if(m.originalUrl && m.originalUrl!==m.preview && m.originalUrl!==m.url) URL.revokeObjectURL(m.originalUrl); };
  const removeMaterial=(id:string)=>{ const idx=materials.findIndex(m=>m.id===id); if(idx>=0 && previewIndex===idx){ setPreviewIndex(null); } else if(previewIndex!==null && idx>=0 && idx<previewIndex){ setPreviewIndex(previewIndex-1); } if(compareId===id) setCompareId(null); if(confirmRecompressId===id) setConfirmRecompressId(null); setMaterials(prev=>{ const target=prev.find(m=>m.id===id); if(target) revokeMaterial(target); return prev.filter(m=>m.id!==id); }); setStatus("File materi dihapus dari daftar."); };
  const clearMaterials=()=>{ setMaterials(prev=>{ prev.forEach(m=>revokeMaterial(m)); return []; }); setPreviewIndex(null); setUploadNotice(null); setCompareId(null); setConfirmRecompressId(null); setStatus("Semua file materi dihapus."); };
  const dismissDocNotice=()=>{ setUploadNotice(null); setStatus("File dokumen yang melebihi batas tidak ditambahkan."); };
  const recompressAgain=async(id:string)=>{
    const target=materials.find(m=>m.id===id); if(!target) return;
    setRecompressingId(id); setConfirmRecompressId(null);
    try{
      const sourceUrl=target.originalUrl || target.url;
      const res=await fetch(sourceUrl); const sourceBlob=await res.blob();
      const newTarget=Math.max(200*1024, Math.floor(target.size*0.6));
      const result=await compressImageBlob(sourceBlob,target.name,newTarget,{qualities:[0.5,0.35,0.25],maxDim:2400});
      if(!result || result.blob.size>=target.size){ setUploadNotice({kind:"warning", text:`File ${target.name} sudah cukup kecil dan tidak bisa dikompres lebih jauh.`}); setStatus(`File ${target.name} tidak bisa dikompres lebih jauh.`); return; }
      const oldUrl=target.url; const oldPreview=target.preview;
      const url=URL.createObjectURL(result.blob);
      setMaterials(prev=>prev.map(m=>m.id===id?{...m,size:result.blob.size,type:result.blob.type||m.type,preview:url,url,quality:Math.round(result.quality*100)}:m));
      if(oldUrl && oldUrl!==oldPreview) URL.revokeObjectURL(oldUrl);
      if(oldPreview) URL.revokeObjectURL(oldPreview);
      const msg=`File ${target.name} dikompres lagi dari ${formatFileSize(target.size)} ke ${formatFileSize(result.blob.size)} (Kualitas: ~${Math.round(result.quality*100)}%).`;
      setUploadNotice({kind:"success", text:msg}); setStatus(msg);
    }catch{
      setUploadNotice({kind:"error", text:`File ${target.name} gagal dikompres lagi.`});
    } finally { setRecompressingId(null); }
  };
  const openPreview=(index:number)=>{ setPdfFallback(false); setPreviewIndex(index); };
  const closePreview=()=>{ setPreviewIndex(null); setPdfFallback(false); };
  const stepPreview=(dir:1|-1)=>{ if(previewIndex===null || !materials.length) return; setPdfFallback(false); setPreviewIndex((previewIndex+dir+materials.length)%materials.length); };
  const downloadMaterial=(m:UploadedMaterial)=>{ const a=document.createElement("a"); a.href=m.url; a.download=m.name; document.body.appendChild(a); a.click(); a.remove(); };
  React.useEffect(()=>{ if(previewIndex===null) return; const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") closePreview(); if(e.key==="ArrowRight") stepPreview(1); if(e.key==="ArrowLeft") stepPreview(-1); }; window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey); },[previewIndex,materials]);
  React.useEffect(()=>{ if(!compareId) return; const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") setCompareId(null); }; window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey); },[compareId]);

  const update=(patch:Partial<FormState>)=>setForm(f=>({...f,...patch}));
  const setColor=(i:number,patch:Partial<{hex:string;name:string}>)=>setForm(f=>({...f,colors:f.colors.map((c,idx)=>idx===i?{...c,...patch}:c)}));
  const changeMedia=(media:string)=>update({media,preset:presets[media][0]});

  const dpiValue=form.dpi==="Custom"?form.customDpi:form.dpi;
  const sizeText=form.sizeMode==="Preset"?form.preset:`${form.width||"—"} × ${form.height||"—"} ${form.unit}`;
  const pixelEstimate=useMemo(()=>{
    const w=Number(form.width),h=Number(form.height),d=Number(dpiValue);
    if(form.sizeMode!=="Custom"||!w||!h||!d) return "";
    let wi=w,hi=h;
    if(form.unit==="cm"){wi=w/2.54;hi=h/2.54}
    if(form.unit==="mm"){wi=w/25.4;hi=h/25.4}
    if(form.unit==="m"){wi=w/39.3701;hi=h/39.3701}
    if(form.unit==="px") return `Ukuran file: ${Math.round(w)} × ${Math.round(h)} px`;
    return `Perkiraan ukuran file: ${Math.round(wi*d).toLocaleString("id-ID")} × ${Math.round(hi*d).toLocaleString("id-ID")} px pada ${d} DPI`;
  },[form.sizeMode,form.width,form.height,form.unit,dpiValue]);

  const buildPrompt=(f:FormState,l:"ID"|"EN",mats:UploadedMaterial[]=materials,limit:SizeLimitMode=sizeLimit)=>{
    const limitLabel=PER_FILE_LABELS[limit];
    const compressedNotes=mats.filter(m=>m.compressed).map(m=>l==="ID"?`Materi ${m.name} sudah dikompres untuk cetak (kualitas tetap terjaga).`:`Material ${m.name} has been compressed for print (quality preserved).`);
    const materialLine=mats.length?`\n\nMateri referensi terlampir: [${mats.map(m=>m.name).join(", ")}] — gunakan sebagai acuan warna, logo, dan komposisi, jangan ubah logo.\nBatas ukuran materi: ${limitLabel}${compressedNotes.length?`\n${compressedNotes.join("\n")}`:""}`:"";
    const brand=f.brand.trim()||"[Nama Brand]";
    const product=f.product.trim()||"[produk/jasa]";
    const headline=f.headline.trim()||"[Headline Utama]";
    const audience=f.audience.trim()||"audiens target yang relevan";
    const promo=f.promo.trim()||"[promo, CTA, dan kontak]";
    const colorDetail=f.colors.map(c=>`${c.name||"Warna"} (${c.hex})`).join(", ");
    const colorLine=f.colorText.trim()?`${f.colorText} — ${colorDetail}`:colorDetail;
    const orientation=f.sizeMode==="Custom"?`, orientasi ${f.orientation}`:"";
    const bleedLine=f.bleed?`Bleed ${f.bleed} mm.`:"";
    const safeLine=f.safeArea?"Sertakan area aman untuk teks dan logo penting.":"";
    const isModernElegant = f.style === "Modern Elegan Natural Profesional";
    const styleKeywordsId = isModernElegant ? "Kata kunci gaya: modern, elegan, natural, profesional, bersih, premium, timeless." : "";
    const styleKeywordsEn = isModernElegant ? "Style keywords: modern, elegant, natural, professional, clean, premium, timeless." : "";
    const isCafeExample = brand === "Kala Coffee" && f.headline.includes("Ngopi Tenang");
    const cafeDetailId = isCafeExample ? " Foto kopi susu gula aren dan croissant butter yang terlihat nyata dan menggugah selera, dengan kesan cafe yang tenang." : "";
    if(l==="ID"){
      return `Buatkan desain ${f.media} yang modern, elegan, dan natural untuk ${brand} — terasa premium, tapi tetap ramah dan mudah dipahami.

Gambaran desainnya seperti ini: tata letak bersih dengan banyak ruang kosong (white space), hierarki teks yang jelas, tipografi modern yang mudah dibaca, warna natural yang lembut dan tidak mencolok, pencahayaan natural, bayangan halus, serta tekstur kertas / material yang terasa nyata.${cafeDetailId} Kesan yang dicari: premium tapi tetap ramah dan mudah dipahami.

Konteks brandnya:
- Brand/usaha: ${brand}
- Produk/jasa yang dipromosikan: ${product}
- Tujuan promosi: ${f.goal}
- Target audiens: ${audience}

Teks yang perlu tampil:
- Headline: "${headline}"
- Promo / CTA & kontak: ${promo}

Ukuran dan teknis cetaknya:
- Ukuran: ${sizeText}${orientation}
- ${bleedLine} ${safeLine}
- Resolusi: ${dpiValue} DPI
- Format file: ${f.format}
- Mode warna: ${f.colorMode}
- Target ukuran file: ${f.target}
- Kualitas: ${f.quality}

Gaya dan warna:
- Gaya desain: ${f.style}
${styleKeywordsId ? `- ${styleKeywordsId}\n` : ``}- Warna dominan: ${colorLine}

Arah desainnya:
- Letakkan headline paling menonjol, lalu produk, promo, dan kontak, dengan urutan yang enak dibaca dari jarak yang sesuai dengan media.
- Jaga kontras teks tetap kuat, beri ruang bernapas antar elemen, dan pastikan tidak ada elemen yang saling menumpuk.
- Teks harus akurat, tanpa typo, dan siap cetak.

Hindari desain yang terlalu ramai, warna neon yang menusuk, dan elemen yang terlihat murahan. Hasil harus terlihat seperti dibuat desainer profesional untuk brand premium.

Hasil ini akan dipakai di AI Image Generator seperti Midjourney, DALL-E, Firefly, atau Ideogram. Buat satu komposisi final yang konsisten dengan semua detail di atas.${materialLine}`;
    }
    return `Create a modern, elegant, natural and professional ${f.media} design for ${brand} — premium yet approachable, warm, and easy to understand.

The visual direction is a clean layout with generous white space, clear text hierarchy, modern typography that is easy to read, soft natural tones, realistic lighting, subtle shadows, and paper / material texture that feels real. The overall impression should feel premium yet approachable.

Brand context:
- Brand/business: ${brand}
- Product/service: ${product}
- Promotion goal: ${f.goal}
- Target audience: ${audience}

Text to feature:
- Headline: "${headline}"
- Promo / CTA & contact: ${promo}

Print size and technical details:
- Size: ${sizeText}${orientation}
- ${bleedLine} ${safeLine}
- Resolution: ${dpiValue} DPI
- File format: ${f.format}
- Colour mode: ${f.colorMode}
- Target file size: ${f.target}
- Quality: ${f.quality}

Style and colour:
- Design style: ${f.style}
${styleKeywordsEn ? `- ${styleKeywordsEn}\n` : ``}- Dominant colours: ${colorLine}

Design direction:
- Make the headline most prominent, followed by the product, promotion, and contact details, in an order that reads comfortably at the right viewing distance.
- Keep text contrast strong, give every element room to breathe, and avoid overlapping elements.
- The text must be accurate, typo-free, and print-ready.

Avoid an overly busy design, harsh neon colours, and anything that looks cheap. The result should look like it was made by a professional designer for a premium brand.

This prompt will be used in an AI image generator such as Midjourney, DALL-E, Firefly, or Ideogram. Create one final composition that follows all the details above.${materialLine}`;
  };

  const generate=(f=form,l=lang,mats:UploadedMaterial[]=materials)=>{
    const prompt=buildPrompt(f,l,mats);
    setResult(prompt); setGenerated(true);
    const missing=[!f.brand.trim()&&"nama brand",!f.headline.trim()&&"headline"].filter(Boolean);
    setStatus(missing.length?`Prompt dibuat. Tambahkan ${missing.join(" dan ")} untuk hasil yang lebih spesifik.`:`Prompt ${l==="ID"?"Bahasa Indonesia":"English"} dibuat untuk ${f.media} — ${sizeText}.`);
  };
  const chooseLang=(l:"ID"|"EN")=>{setLang(l); if(generated||result) generate(form,l);};
  const randomStyle=()=>{const options=styles.filter(s=>s!==form.style); const next=options[Math.floor(Math.random()*options.length)]; const nextForm={...form,style:next}; setForm(nextForm); setStatus(`Gaya diubah ke ${next}.`); if(generated) generate(nextForm,lang);};
  const applyModernElegantStyle=()=>{const nextForm={...form,style:"Modern Elegan Natural Profesional"}; setForm(nextForm); generate(nextForm,lang); setStatus("Gaya diubah ke Modern Elegan Natural Profesional — modern, elegan, natural, profesional, bersih, premium, timeless.");};
  const loadExample=(ex:typeof examples[number])=>{const next={...form,...ex.patch}; setForm(next); setActiveExample(ex.title); generate(next,lang); setStatus(`Contoh “${ex.title}” dimuat. Sesuaikan isi form bila perlu.`); if(ex.title==="Contoh: Flyer Cafe — Modern Elegan"){ setTimeout(()=>{ document.getElementById("result-panel")?.scrollIntoView({behavior:"smooth",block:"start"}); },60); } else { window.scrollTo({top:0,behavior:"smooth"}); }};
  const copyPrompt=()=>{
    const el=resultRef.current; if(!el||!result) return;
    el.focus(); el.select(); const ok=document.execCommand("copy");
    if(ok){setCopied(true); setStatus("Prompt tersalin. Siap ditempel ke AI Image Generator."); setTimeout(()=>setCopied(false),2000);}
    else setStatus("Salin otomatis belum berhasil. Blok teks hasil lalu salin secara manual.");
  };
  const downloadTxt=()=>{
    if(!result) return;
    const blob=new Blob([result],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=`prompt-${slug(form.brand||form.media)}-${slug(form.media)}.txt`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000); setStatus("File .txt disiapkan untuk diunduh.");
  };

  return <div data-safe-area-inset-root className="min-h-screen bg-[var(--bg)] text-[var(--ink)]" style={{boxSizing:"border-box",paddingTop:"var(--safe-area-inset-top)"}}>
    <header data-safe-area-sticky-top className="sticky z-20 border-b border-[var(--border)] bg-[#0F172A] text-white" style={{top:"var(--safe-area-inset-top)"}}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]"><Printer size={24}/></div>
        <div className="min-w-0 flex-1"><h1 className="text-xl font-extrabold leading-tight sm:text-2xl">Generator Prompt Media Cetak</h1><p className="text-sm text-slate-300">Flyer • Spanduk • Billboard • Semua Media Promosi</p></div>
        <div className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200">Siap cetak • Tanpa perlu akun</div>
      </div>
    </header>

    <main className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold text-[#2563EB]">LANGKAH 1 — ISI FORM &nbsp;→&nbsp; LANGKAH 2 — HASIL</p><h2 className="mt-1 max-w-2xl text-2xl font-extrabold leading-tight">Ubah ide promosi jadi prompt yang rapi dan siap cetak.</h2></div>
        <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Isi secukupnya. Ukuran dan file bisa dibuat preset atau bebas sesuai kebutuhan percetakan.</p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6" aria-labelledby="form-title">
          <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Form Desain</p><h2 id="form-title" className="mt-1 text-lg font-extrabold">Detail Media Promosi</h2></div><span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold">14 jenis media</span></div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="media">1. Jenis Media</label><div className="relative"><select id="media" className="field appearance-none pr-10" value={form.media} onChange={e=>changeMedia(e.target.value)}>{mediaTypes.map(m=><option key={m}>{m}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/></div></div>
              <div><label className="label" htmlFor="goal">4. Tujuan Promosi</label><div className="relative"><select id="goal" className="field appearance-none pr-10" value={form.goal} onChange={e=>update({goal:e.target.value})}>{goals.map(g=><option key={g}>{g}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/></div></div>
            </div>
            <div><label className="label" htmlFor="brand">2. Nama Brand / Usaha</label><input id="brand" className="field" value={form.brand} onChange={e=>update({brand:e.target.value})} placeholder="contoh Warung Sunda Asli"/></div>
            <div><label className="label" htmlFor="product">3. Produk / Jasa yang Dipromosikan</label><input id="product" className="field" value={form.product} onChange={e=>update({product:e.target.value})} placeholder="contoh Paket nasi liwet untuk 4 orang"/></div>
            <div><label className="label" htmlFor="audience">5. Target Audiens</label><input id="audience" className="field" value={form.audience} onChange={e=>update({audience:e.target.value})} placeholder="Keluarga usia 20-50 tahun"/></div>
            <div><label className="label" htmlFor="headline">6. Judul / Headline Utama</label><input id="headline" className="field" value={form.headline} onChange={e=>update({headline:e.target.value})} placeholder="Tulis pesan yang paling ingin dilihat pertama"/></div>
            <div><label className="label" htmlFor="promo">7. Promo / CTA & Kontak</label><textarea id="promo" rows={3} className="field resize-y leading-6" value={form.promo} onChange={e=>update({promo:e.target.value})} placeholder="Diskon 20%, WA 0812..., IG @..."/></div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-extrabold">Materi Pendukung (Opsional)</h3><p className="mt-1 text-sm leading-5 text-[var(--muted)]">Upload logo, foto produk, atau referensi desain untuk dipakai sebagai acuan.</p></div>{materials.length>1&&<button type="button" onClick={clearMaterials} className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><Trash2 size={15}/> Hapus Semua</button>}</div>
              <fieldset className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <legend className="label px-1">Batas Ukuran File:</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Batas ukuran file">
                  {(["Middle","High"] as const).map(mode=><button key={mode} type="button" role="radio" aria-checked={sizeLimit===mode} onClick={()=>changeSizeLimit(mode)} className={`rounded-full border px-3 py-2 text-xs font-bold ${sizeLimit===mode?"border-[#2563EB] bg-[#2563EB] text-white":"border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"}`}>{mode} - Maks. {mode==="Middle"?"5 MB":"25 MB"} / file</button>)}
                </div>
                <label className="mt-3 flex min-h-[40px] cursor-pointer items-start gap-2 text-sm font-semibold"><input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563EB]" checked={autoCompress} onChange={e=>setAutoCompress(e.target.checked)}/>Kompres otomatis jika melebihi batas</label>
                <p className="mt-1 pl-6 text-xs leading-5 text-[var(--muted)]">Untuk gambar, file akan dikompres otomatis agar masuk batas. Untuk PDF/DOC, kompres manual disarankan.</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold"><span>Total: {formatTotalMB(totalUsed)} / Maks. Total 50 MB</span><span>{totalPercent}%</span></div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={totalPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Total ukuran file terpakai"><div className="h-full rounded-full bg-[#2563EB]" style={{width:`${totalPercent}%`}}/></div>
                {overLimitCount>0&&<p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700"><AlertTriangle size={14}/> {overLimitCount} file melebihi batas {sizeLimit}.</p>}
              </fieldset>
              <div role="button" tabIndex={0} aria-label="Area upload file materi" onClick={()=>fileInputRef.current?.click()} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault(); fileInputRef.current?.click();}}} onDragEnter={e=>{e.preventDefault(); setDragOver(true);}} onDragOver={e=>{e.preventDefault(); setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault(); setDragOver(false); addMaterials(e.dataTransfer.files);}} className={`mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center ${dragOver?"border-[#2563EB] bg-blue-50":"border-[var(--border)] bg-[var(--surface-2)]"}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-white"><Upload size={20}/></span>
                <button type="button" onClick={e=>{e.stopPropagation(); fileInputRef.current?.click();}} disabled={compressing} className="mt-3 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8] disabled:opacity-60">{compressing?"Mengompres…":"Upload File Materi"}</button>
                <p className="mt-2 text-sm text-[var(--muted)]">atau seret file ke sini</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" className="sr-only" aria-label="Pilih file materi" onChange={e=>{ if(e.target.files) addMaterials(e.target.files); e.target.value=""; }} />
              </div>
              <p className="hint mt-2">Maks. 10 file • Gambar, PDF, DOC, TXT • File hanya diproses di browser ini</p>
              {compressing&&<div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-[#2563EB]" role="status"><Loader2 size={16} className="animate-spin"/> Mengompres gambar… mohon tunggu.</div>}
              {uploadNotice&&<div role={uploadNotice.kind==="error"?"alert":"status"} className={`mt-2 rounded-lg px-3 py-2.5 text-sm font-semibold ${uploadNotice.kind==="error"?"bg-red-50 text-red-700":uploadNotice.kind==="warning"?"bg-amber-50 text-amber-800":"bg-emerald-50 text-emerald-700"}`}><p>{uploadNotice.text}</p>{uploadNotice.showDocActions&&<span className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={()=>{changeSizeLimit("High"); setUploadNotice({kind:"success", text:"Batas diubah ke High. Silakan upload ulang file dokumen tersebut."});}} className="rounded-md bg-[#0F172A] px-3 py-2 text-xs font-bold text-white">Ganti ke High</button><button type="button" onClick={dismissDocNotice} className="rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-800">Hapus File</button></span>}</div>}
              {materials.length===0?<p className="mt-3 rounded-lg bg-[var(--surface-2)] px-3 py-3 text-center text-sm text-[var(--muted)]">Belum ada materi yang di-upload</p>:<ul className="mt-3 space-y-2">{materials.map((m,idx)=>{ const over=m.size>perFileLimit; return <li key={m.id} onClick={()=>openPreview(idx)} title={m.compressed&&m.originalSize?`Ukuran asli: ${formatFileSize(m.originalSize)}`:`Ukuran: ${formatFileSize(m.size)}`} className={`cursor-pointer rounded-lg border p-2.5 ${over?"border-amber-300 bg-amber-50/50":m.compressed?"border-emerald-200 bg-emerald-50/40":"border-[var(--border)]"}`}><div className="flex min-w-0 items-center gap-3">{m.preview?<img src={m.preview} alt={m.name} className="h-11 w-11 shrink-0 rounded-md border border-[var(--border)] object-cover"/>:<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--surface-2)] text-[#2563EB]"><FileText size={20}/></span>}<span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{m.name}</span><span className="block text-xs text-[var(--muted)]">{m.compressed&&m.originalSize?`${formatFileSize(m.originalSize)} → ${formatFileSize(m.size)}` : formatFileSize(m.size)}</span>{m.compressed&&<span className="mt-1 flex flex-wrap items-center gap-1.5"><span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">Dikompres</span><span className="text-[11px] font-semibold text-emerald-700">Kualitas: ~{m.quality ?? 70}%</span></span>}</span><button type="button" onClick={e=>{e.stopPropagation(); openPreview(idx);}} className="flex min-h-[36px] shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><Eye size={14}/> Preview</button><button type="button" onClick={e=>{e.stopPropagation(); removeMaterial(m.id);}} aria-label={`Hapus ${m.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><X size={16}/></button></div>{m.compressed&&<div className="mt-2 flex flex-wrap items-center gap-2"><button type="button" onClick={e=>{e.stopPropagation(); setCompareTab("compressed"); setCompareId(m.id);}} className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><GitCompareArrows size={14}/> Lihat Sebelum / Sesudah</button><button type="button" disabled={recompressingId===m.id} onClick={e=>{e.stopPropagation(); setConfirmRecompressId(m.id);}} className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-bold text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-60"><RefreshCw size={14}/> {recompressingId===m.id?"Mengompres…":"Kompres Lagi"}</button>{m.originalSize&&<span className="text-[11px] font-semibold text-[var(--muted)]" title={`Ukuran asli: ${formatFileSize(m.originalSize)}`}>Ukuran asli: {formatFileSize(m.originalSize)}</span>}</div>}{confirmRecompressId===m.id&&<div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-800"><p>Kompres lagi dengan kualitas lebih rendah? Ukuran file akan mengecil, kualitas gambar sedikit menurun.</p><span className="mt-2 flex gap-2"><button type="button" onClick={e=>{e.stopPropagation(); recompressAgain(m.id);}} className="rounded-md bg-[#0F172A] px-3 py-2 text-xs font-bold text-white">Ya, Kompres Lagi</button><button type="button" onClick={e=>{e.stopPropagation(); setConfirmRecompressId(null);}} className="rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-800">Batal</button></span></div>}{over&&<div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-amber-100 px-2.5 py-2 text-xs font-semibold text-amber-800"><AlertTriangle size={14} className="shrink-0"/> Melebihi batas {sizeLimit} <span className="flex flex-wrap gap-2"><button type="button" onClick={e=>{e.stopPropagation(); changeSizeLimit("High");}} className="rounded-md bg-[#0F172A] px-2.5 py-1.5 text-xs font-bold text-white">Ganti ke High</button><button type="button" onClick={e=>{e.stopPropagation(); removeMaterial(m.id);}} className="rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-xs font-bold text-amber-800">Hapus file ini</button></span></div>}</li>})}</ul>}
            </div>

            <fieldset><legend className="label">8. Gaya Desain</legend><div className="flex flex-wrap gap-2">{styles.map(s=><button key={s} type="button" className="chip" aria-pressed={form.style===s} onClick={()=>update({style:s})}>{s}</button>)}</div></fieldset>
            <div><label className="label" htmlFor="colorText">9. Warna Dominan</label><div className="mb-2 grid grid-cols-3 gap-2">{form.colors.map((c,i)=><div key={i} className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--border)] p-1.5"><input aria-label={`Warna ${i+1}`} type="color" className="h-9 w-10 shrink-0 rounded border-0 bg-transparent" value={c.hex} onChange={e=>setColor(i,{hex:e.target.value})}/><input aria-label={`Nama warna ${i+1}`} className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold outline-none" value={c.name} onChange={e=>setColor(i,{name:e.target.value})}/></div>)}</div><input id="colorText" className="field" value={form.colorText} onChange={e=>update({colorText:e.target.value})} placeholder="contoh Merah + Krem"/><p className="hint mt-1">Nama warna bebas akan digabung dengan kode warna di atas.</p></div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex items-center gap-2"><Ruler size={18} className="text-[#2563EB]"/><h3 className="font-extrabold">10. Ukuran — Bebas</h3></div>
              <fieldset className="mt-3"><legend className="sr-only">Mode ukuran</legend><div className="grid grid-cols-2 gap-2">{(["Preset","Custom"] as const).map(mode=><button key={mode} type="button" aria-pressed={form.sizeMode===mode} onClick={()=>update({sizeMode:mode})} className={`rounded-lg border px-3 py-2.5 text-sm font-bold ${form.sizeMode===mode?"border-[#2563EB] bg-[#2563EB] text-white":"border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"}`}>{mode}</button>)}</div></fieldset>
              {form.sizeMode==="Preset"?<div className="mt-3"><label className="label" htmlFor="preset">Ukuran Preset — {form.media}</label><div className="relative"><select id="preset" className="field appearance-none pr-10" value={form.preset} onChange={e=>update({preset:e.target.value})}>{presets[form.media].map(p=><option key={p}>{p}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/></div><p className="hint mt-2">Preset berubah otomatis saat jenis media diganti.</p></div>:<div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="col-span-1"><label className="label" htmlFor="width">Lebar</label><input id="width" type="number" min="0" step="0.1" className="field" value={form.width} onChange={e=>update({width:e.target.value})}/></div>
                <div><label className="label" htmlFor="height">Tinggi</label><input id="height" type="number" min="0" step="0.1" className="field" value={form.height} onChange={e=>update({height:e.target.value})}/></div>
                <div><label className="label" htmlFor="unit">Satuan</label><select id="unit" className="field" value={form.unit} onChange={e=>update({unit:e.target.value})}>{units.map(u=><option key={u}>{u}</option>)}</select></div>
                <div><label className="label" htmlFor="orientation">Orientasi</label><select id="orientation" className="field" value={form.orientation} onChange={e=>update({orientation:e.target.value})}>{orientations.map(o=><option key={o}>{o}</option>)}</select></div>
                <p className="col-span-2 hint sm:col-span-4">{pixelEstimate||"Masukkan lebar dan tinggi untuk melihat perkiraan piksel."}</p>
              </div>}
              <div className="mt-3 flex flex-wrap items-end gap-3"><div><label className="label" htmlFor="bleed">Bleed</label><div className="flex items-center gap-2"><input id="bleed" type="number" min="0" step="0.5" className="field w-24" value={form.bleed} onChange={e=>update({bleed:e.target.value})}/><span className="text-sm text-[var(--muted)]">mm</span></div></div><label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-[#2563EB]" checked={form.safeArea} onChange={e=>update({safeArea:e.target.checked})}/>Sertakan area aman</label></div>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <div className="flex items-center gap-2"><FileText size={18} className="text-[#2563EB]"/><h3 className="font-extrabold">11. Size File — Bebas</h3></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <fieldset><legend className="label">Resolusi / DPI</legend><div className="flex flex-wrap gap-2">{dpis.map(d=><button key={d} type="button" aria-pressed={form.dpi===d} onClick={()=>update({dpi:d})} className="chip">{d==="Custom"?"Custom DPI":`${d} DPI`}</button>)}</div>{form.dpi==="Custom"&&<label className="mt-2 block"><span className="sr-only">Custom DPI</span><input type="number" min="1" className="field" value={form.customDpi} onChange={e=>update({customDpi:e.target.value})} placeholder="Masukkan DPI"/></label>}</fieldset>
                <div><label className="label" htmlFor="format">Format File</label><select id="format" className="field" value={form.format} onChange={e=>update({format:e.target.value})}>{formats.map(f=><option key={f}>{f}</option>)}</select></div>
                <fieldset><legend className="label">Mode Warna</legend><div className="grid grid-cols-2 gap-2">{["CMYK (Cetak)","RGB (Digital)"].map(m=><button key={m} type="button" aria-pressed={form.colorMode===m} onClick={()=>update({colorMode:m})} className="chip text-center">{m}</button>)}</div></fieldset>
                <div><label className="label" htmlFor="target">Target Ukuran File</label><select id="target" className="field" value={form.target} onChange={e=>update({target:e.target.value})}>{fileTargets.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <fieldset className="mt-4"><legend className="label">Kualitas</legend><div className="flex flex-wrap gap-2">{qualities.map(q=><button key={q} type="button" aria-pressed={form.quality===q} onClick={()=>update({quality:q})} className="chip">{q}</button>)}</div></fieldset>
            </div>

            <button type="button" onClick={()=>generate()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3.5 font-bold text-white hover:bg-[#1D4ED8]"><Sparkles size={20}/> Generate Prompt</button>
            <p className="text-center text-xs text-[var(--muted)]">Prompt dibuat di perangkat ini. Tidak ada data yang dikirim atau disimpan.</p>
          </div>
        </section>

        <section id="result-panel" className="lg:sticky lg:top-24" aria-labelledby="result-title">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Hasil Prompt</p><h2 id="result-title" className="mt-1 text-xl font-bold text-[#1F2937]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Hasil Prompt</h2><p className="mt-1 text-sm text-slate-600">Siap tempel ke AI Image Generator</p></div><div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-1" role="group" aria-label="Bahasa prompt"><button type="button" aria-pressed={lang==="ID"} onClick={()=>chooseLang("ID")} className={`rounded-md px-3 py-1.5 text-xs font-bold ${lang==="ID"?"bg-[#0F172A] text-white":"text-[var(--muted)]"}`}>Bahasa Indonesia</button><button type="button" aria-pressed={lang==="EN"} onClick={()=>chooseLang("EN")} className={`rounded-md px-3 py-1.5 text-xs font-bold ${lang==="EN"?"bg-[#0F172A] text-white":"text-[var(--muted)]"}`}>English</button></div></div>

            <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={()=>generate()} className="flex items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-bold text-white"><Sparkles size={17}/> Generate Prompt</button><button type="button" onClick={applyModernElegantStyle} aria-pressed={form.style==="Modern Elegan Natural Profesional"} className="flex items-center gap-2 rounded-lg border border-[#E5E0D8] bg-[#FEFEFE] px-4 py-2.5 text-sm font-bold text-[#1F2937] hover:border-[#2563EB] hover:text-[#2563EB]"><Sparkles size={17}/> Gaya: Modern Elegan</button><button type="button" onClick={copyPrompt} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]">{copied?<Check size={17} className="text-emerald-600"/>:<Copy size={17}/>} {copied?"Tersalin!":"Salin Prompt"}</button><button type="button" onClick={downloadTxt} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]"><Download size={17}/> Download .txt</button><button type="button" onClick={randomStyle} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]"><Dices size={17}/> Acak Gaya</button></div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{form.media}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{sizeText}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{dpiValue} DPI • {form.format}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{form.colorMode}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{form.style}</span></div>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8A7F72]"><span>Modern</span><span aria-hidden="true">•</span><span>Elegan</span><span aria-hidden="true">•</span><span>Natural</span><span aria-hidden="true">•</span><span>Profesional</span></p>
            {activeExample==="Contoh: Flyer Cafe — Modern Elegan"&&<p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F5EFE6] px-3 py-1.5 text-xs font-bold text-[#6B4F2A] ring-1 ring-[#C8A97E]">Contoh Aktif: Flyer Cafe — Modern Elegan</p>}
            <label className="sr-only" htmlFor="result">Hasil prompt</label>
            <textarea id="result" ref={resultRef} readOnly value={result||"Prompt Anda akan muncul di sini.\n\nContoh singkat:\n\nBuatkan desain Flyer yang modern, elegan, dan natural untuk Warung Sunda Asli — terasa premium, tapi tetap ramah dan mudah dipahami.\n\nUkuran A5 14,8 × 21 cm, orientasi Portrait, Resolusi 300 DPI, Format PDF Print, Mode Warna CMYK..."} className="result mt-2 min-h-[430px] w-full resize-y rounded-[12px] border border-[#E5E0D8] bg-[#FEFEFE] p-5 text-[14px] text-slate-800 shadow-[0_2px_12px_rgba(31,41,55,0.05)] focus:border-[#2563EB] focus:outline-none" style={{lineHeight:1.7}}/>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Karakter hasil prompt"><span className="rounded-full border border-[#E5E0D8] bg-[#FEFEFE] px-3 py-1.5 text-xs font-bold text-[#5B5348]">Modern</span><span className="rounded-full border border-[#E5E0D8] bg-[#FEFEFE] px-3 py-1.5 text-xs font-bold text-[#5B5348]">Elegan &amp; Natural</span><span className="rounded-full border border-[#E5E0D8] bg-[#FEFEFE] px-3 py-1.5 text-xs font-bold text-[#5B5348]">Siap Cetak Profesional</span></div>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-slate-700" role="status"><Lightbulb size={18} className="mt-0.5 shrink-0 text-[#2563EB]"/><span>{status}</span></div>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
            <div className="flex items-center gap-2"><MousePointerClick size={18} className="text-[#2563EB]"/><h3 className="font-extrabold">Contoh Siap Pakai</h3></div><p className="mt-1 text-sm text-[var(--muted)]">Klik salah satu untuk mengisi form dan membuat prompt secara otomatis.</p>
            <div className="mt-4 rounded-xl border-2 border-[#C8A97E] bg-[#FDFBF7] p-4">
              <span className="inline-flex rounded-full bg-[#A8B8A0] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Contoh Unggulan</span>
              <p className="mt-2 font-bold">Contoh: Flyer Cafe — Modern Elegan</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Klik untuk lihat langsung nuansa modern, elegan, natural, profesional</p>
              <div className="mt-3 flex items-center gap-1.5" aria-hidden="true"><span className="h-5 w-5 rounded-full border border-black/10 bg-[#F5EFE6]" title="Krem hangat"/><span className="h-5 w-5 rounded-full border border-black/10 bg-[#C8A97E]" title="Coklat muda"/><span className="h-5 w-5 rounded-full border border-black/10 bg-[#A8B8A0]" title="Sage green"/></div>
              <button type="button" onClick={()=>loadExample(examples[0])} className="mt-3 w-full rounded-lg bg-[#0F172A] px-4 py-3 text-sm font-bold text-white hover:bg-[#2563EB]">Lihat Contoh Flyer Cafe</button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{examples.slice(1).map(ex=><button key={ex.title} type="button" onClick={()=>loadExample(ex)} className="rounded-xl border border-[var(--border)] p-3 text-left hover:border-[#2563EB] hover:shadow-sm"><span className="block font-bold">{ex.title}</span><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{ex.desc}</span><span className="mt-2 block text-xs font-bold text-[#2563EB]">Gunakan contoh →</span></button>)}</div>
          </div>
        </section>
      </div>

      <footer className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-center text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--ink)]">Tips:</strong> Untuk cetak besar gunakan 150–300 DPI &amp; CMYK. Periksa bleed, area aman, dan ejaan sebelum mengirim file ke percetakan.</footer>
    </main>
    {previewMaterial&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6" onClick={closePreview} role="presentation">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[var(--surface)] shadow-2xl" role="dialog" aria-modal="true" aria-label={`Preview ${previewMaterial.name}`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{previewMaterial.name}</p><p className="text-xs text-[var(--muted)]">File {previewIndex!==null?previewIndex+1:1} dari {materials.length} • {formatFileSize(previewMaterial.size)}</p></div>
          <button type="button" onClick={closePreview} aria-label="Tutup preview" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><X size={18}/></button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[var(--surface-2)] p-3 sm:p-5">
          {fileKind(previewMaterial)==="image"?<img src={previewMaterial.preview||previewMaterial.url} alt={previewMaterial.name} className="max-h-[62vh] max-w-full rounded-lg border border-[var(--border)] bg-white object-contain"/>
          :fileKind(previewMaterial)==="pdf"?(pdfFallback?<div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"><FileText size={32} className="mx-auto text-[#2563EB]"/><p className="mt-3 font-extrabold">Preview PDF tidak tersedia di browser ini</p><p className="mt-1 text-sm text-[var(--muted)]">Silakan unduh file untuk melihat isinya.</p><button type="button" onClick={()=>downloadMaterial(previewMaterial)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]"><Download size={16}/> Download File</button></div>:<div className="flex h-[62vh] w-full flex-col"><object data={previewMaterial.url} type="application/pdf" className="h-full w-full rounded-lg border border-[var(--border)] bg-white" title={previewMaterial.name}><div className="p-5 text-center"><p className="font-extrabold">Preview PDF tidak tersedia di browser ini</p><button type="button" onClick={()=>downloadMaterial(previewMaterial)} className="mt-3 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white">Download File</button></div></object><button type="button" onClick={()=>setPdfFallback(true)} className="mt-2 shrink-0 self-center text-xs font-bold text-[#2563EB] underline">Preview tidak tampil? Tampilkan pesan fallback</button></div>)
          :<div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"><FileText size={32} className="mx-auto text-[#2563EB]"/><p className="mt-3 break-words font-extrabold">{previewMaterial.name}</p><p className="mt-1 text-sm text-[var(--muted)]">Ukuran: {formatFileSize(previewMaterial.size)}</p><p className="mt-1 text-sm text-[var(--muted)]">Tipe: {previewMaterial.type||"Dokumen"}</p><button type="button" onClick={()=>downloadMaterial(previewMaterial)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8]"><Download size={16}/> Download File</button></div>}
        </div>
        <div className="border-t border-[var(--border)] px-4 py-3">
          <p className="truncate text-center text-sm"><span className="font-bold">{previewMaterial.name}</span> <span className="text-[var(--muted)]">• {formatFileSize(previewMaterial.size)}</span></p>
          <div className="mt-2 flex items-center justify-between gap-2"><button type="button" onClick={()=>stepPreview(-1)} className="flex min-h-[40px] items-center gap-1 rounded-lg border border-[var(--border)] px-3 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]"><ChevronLeft size={16}/> Sebelumnya</button><button type="button" onClick={()=>downloadMaterial(previewMaterial)} className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]"><Download size={15}/> Download</button><button type="button" onClick={()=>stepPreview(1)} className="flex min-h-[40px] items-center gap-1 rounded-lg border border-[var(--border)] px-3 text-sm font-bold hover:border-[#2563EB] hover:text-[#2563EB]">Berikutnya <ChevronRight size={16}/></button></div>
        </div>
      </div>
    </div>}
    {compareMaterial&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6" onClick={()=>setCompareId(null)} role="presentation">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[var(--surface)] shadow-2xl" role="dialog" aria-modal="true" aria-label={`Sebelum dan sesudah ${compareMaterial.name}`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">Sebelum / Sesudah — {compareMaterial.name}</p><p className="text-xs text-[var(--muted)]">{compareMaterial.originalSize?`${formatFileSize(compareMaterial.originalSize)} → ${formatFileSize(compareMaterial.size)}` : formatFileSize(compareMaterial.size)} • Kualitas: ~{compareMaterial.quality ?? 70}%</p></div>
          <button type="button" onClick={()=>setCompareId(null)} aria-label="Tutup perbandingan" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[#2563EB] hover:text-[#2563EB]"><X size={18}/></button>
        </div>
        <div className="flex gap-2 border-b border-[var(--border)] px-4 py-2" role="tablist" aria-label="Perbandingan kompres">
          <button type="button" role="tab" aria-selected={compareTab==="original"} onClick={()=>setCompareTab("original")} className={`rounded-lg px-3 py-2 text-sm font-bold ${compareTab==="original"?"bg-[#0F172A] text-white":"border border-[var(--border)] text-[var(--muted)]"}`}>Asli{compareMaterial.originalSize?` • ${formatFileSize(compareMaterial.originalSize)}`:""}</button>
          <button type="button" role="tab" aria-selected={compareTab==="compressed"} onClick={()=>setCompareTab("compressed")} className={`rounded-lg px-3 py-2 text-sm font-bold ${compareTab==="compressed"?"bg-[#2563EB] text-white":"border border-[var(--border)] text-[var(--muted)]"}`}>Hasil Kompres • {formatFileSize(compareMaterial.size)}</button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[var(--surface-2)] p-3 sm:p-5">
          {compareTab==="original" ? (compareMaterial.originalUrl ? <img src={compareMaterial.originalUrl} alt={`Asli ${compareMaterial.name}`} className="max-h-[58vh] max-w-full rounded-lg border border-[var(--border)] bg-white object-contain"/> : <div className="max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center"><p className="font-extrabold">File asli tidak disimpan</p><p className="mt-1 text-sm text-[var(--muted)]">Hanya hasil kompres yang ditampilkan di bawah, dengan info ukuran asli: {compareMaterial.originalSize?formatFileSize(compareMaterial.originalSize):"—"}.</p><img src={compareMaterial.preview} alt={compareMaterial.name} className="mx-auto mt-4 max-h-[40vh] max-w-full rounded-lg border border-[var(--border)] bg-white object-contain"/></div>)
          : <img src={compareMaterial.preview||compareMaterial.url} alt={`Hasil kompres ${compareMaterial.name}`} className="max-h-[58vh] max-w-full rounded-lg border border-[var(--border)] bg-white object-contain"/>}
        </div>
        <div className="border-t border-[var(--border)] px-4 py-3 text-center text-sm"><span className="font-bold">{compareTab==="original"?"Asli":"Hasil Kompres"}</span> <span className="text-[var(--muted)]">• {compareTab==="original"?(compareMaterial.originalSize?formatFileSize(compareMaterial.originalSize):"Ukuran asli tidak tersedia"):formatFileSize(compareMaterial.size)}</span>{compareMaterial.originalSize&&<span className="block text-xs text-[var(--muted)]">Ukuran asli: {formatFileSize(compareMaterial.originalSize)}</span>}</div>
      </div>
    </div>}
  </div>
}
