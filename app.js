document.getElementById('year').textContent=new Date().getFullYear();
let ar=false;
const en={eyebrow:"A public-benefit platform",title:"A Better World Starts With You",intro:"Explore useful information about health, learning, personal safety, and protecting our planet. Small actions can make a meaningful difference in every community.",cta:"Explore the platform",healthTitle:"Health Awareness",healthText:"Read general wellness and prevention information from reliable sources. This site does not diagnose or treat medical conditions.",learnTitle:"Free Learning",learnText:"Discover learning resources, digital skills, languages, and useful knowledge for everyday life.",safetyTitle:"Safety Guidance",safetyText:"Learn general preparedness tips and follow official local instructions during emergencies.",environmentTitle:"Environment",environmentText:"Find practical ideas for reducing waste, saving water, recycling, and caring for green spaces.",communityTitle:"Community Action",communityText:"Support volunteering and positive community initiatives. Verify organizations before sharing information or donations.",accessTitle:"For Everyone",accessText:"A simple, mobile-friendly platform designed to grow with more languages and resources over time.",aboutTitle:"About World Benefit",aboutText:"World Benefit aims to make useful, reliable public-interest information easier to find. Content is educational and should be checked against qualified professionals and official sources where appropriate.",notice:"Emergency: this website is not an emergency service. Contact your local emergency services when immediate help is needed.",piHeading:"Pi Network Sign In",piIntro:"Sign in with Pi to connect your Pioneer account to World Benefit.",piLogin:"Sign in with Pi Network",notSigned:"You are not signed in yet.",working:"Connecting to Pi Network…",signedIn:"Pi sign-in was verified by the app service.",failed:"Sign-in could not be completed. Open this app in Pi Browser/Sandbox and try again.",serverError:"Pi sign-in was received, but app-service verification failed. Please try again later."};
const arTxt={eyebrow:"منصة للمنفعة العامة",title:"عالم أفضل يبدأ بخطوة منك",intro:"اكتشف معلومات مفيدة عن الصحة والتعلم والسلامة الشخصية وحماية كوكبنا. فالخطوات الصغيرة يمكن أن تُحدث فرقًا إيجابيًا في كل مجتمع.",cta:"استكشف المنصة",healthTitle:"التوعية الصحية",healthText:"اقرأ معلومات عامة عن العافية والوقاية من مصادر موثوقة. هذا الموقع لا يشخّص الأمراض ولا يعالجها.",learnTitle:"التعلم المجاني",learnText:"اكتشف موارد التعلم والمهارات الرقمية واللغات والمعارف المفيدة للحياة اليومية.",safetyTitle:"إرشادات السلامة",safetyText:"تعرّف على الاستعداد العام للطوارئ واتبع تعليمات الجهات الرسمية المحلية.",environmentTitle:"البيئة",environmentText:"اكتشف أفكارًا عملية لتقليل النفايات وتوفير المياه وإعادة التدوير والعناية بالمساحات الخضراء.",communityTitle:"المبادرات المجتمعية",communityText:"ادعم التطوع والمبادرات الإيجابية. تحقّق من الجهات قبل مشاركة المعلومات أو التبرع.",accessTitle:"منصة للجميع",accessText:"منصة بسيطة مناسبة للهواتف، قابلة للتوسع بلغات وموارد إضافية بمرور الوقت.",aboutTitle:"عن World Benefit",aboutText:"تهدف World Benefit إلى تسهيل الوصول إلى معلومات موثوقة ومفيدة للمصلحة العامة. المحتوى للتثقيف، وينبغي التحقق منه لدى المختصين والمصادر الرسمية عند الحاجة.",notice:"تنبيه للطوارئ: هذا الموقع ليس خدمة طوارئ. اتصل بخدمات الطوارئ المحلية عند الحاجة إلى مساعدة فورية.",piHeading:"تسجيل الدخول عبر Pi Network",piIntro:"سجّل الدخول عبر Pi لربط حسابك بتطبيق World Benefit.",piLogin:"تسجيل الدخول عبر Pi Network",notSigned:"لم تسجّل الدخول بعد.",working:"جارٍ الاتصال بشبكة Pi…",signedIn:"تم التحقق من تسجيل الدخول عبر خدمة التطبيق.",failed:"تعذّر إكمال تسجيل الدخول. افتح التطبيق في Pi Browser أو Sandbox وحاول مجددًا.",serverError:"وصل طلب تسجيل الدخول لكن تعذّر التحقق منه عبر خدمة التطبيق. حاول لاحقًا."};
function setStatus(key){document.getElementById('piStatus').textContent=(ar?arTxt:en)[key]||key}
document.getElementById('langBtn').addEventListener('click',()=>{ar=!ar;const d=ar?arTxt:en;Object.keys(d).forEach(k=>{const e=document.getElementById(k);if(e)e.textContent=d[k]});document.documentElement.lang=ar?'ar':'en';document.documentElement.dir=ar?'rtl':'ltr';document.getElementById('langBtn').textContent=ar?'English':'العربية';});
async function onIncompletePaymentFound(payment){ console.info('Incomplete Pi payment found; follow Pi SDK payment recovery flow.', payment); }
let piInitPromise=null;
async function ensurePiInitialized(){
 if(!window.Pi) throw new Error('Pi SDK unavailable');
 if(!piInitPromise) piInitPromise=window.Pi.init({version:'2.0'});
 await piInitPromise;
}
async function piSignIn(){
 const btn=document.getElementById('piLogin');btn.disabled=true;setStatus('working');
 try{
   await ensurePiInitialized();
   const auth=await Pi.authenticate(["username"],onIncompletePaymentFound);
   if(!auth||!auth.accessToken) throw new Error('No Pi access token');
   const response=await fetch('https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login',{
     method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessToken:auth.accessToken})
   });
   if(!response.ok) throw new Error('App service rejected sign-in');
   const result=await response.json();
   if(!result||!result.sessionToken) throw new Error('No verified session token');
   // Only use the identity returned by App Studio after server-side verification.
   const verifiedUser=result.user;
   if(!verifiedUser || typeof verifiedUser.uid !== 'string' || typeof verifiedUser.username !== 'string') throw new Error('Missing verified App Studio identity');
   // Static frontend session: keep credentials in memory only; never trust browser auth uid/username.
   window.worldBenefitSession={sessionToken:result.sessionToken,user:{uid:verifiedUser.uid,username:verifiedUser.username}};
   document.getElementById('piUser').textContent=(ar?'تم تسجيل الدخول باسم: ':'Signed in as: ')+window.worldBenefitSession.user.username;
   setStatus('signedIn');
   btn.textContent=ar?'تم تسجيل الدخول':'Signed in';
 }catch(err){console.error('Pi sign-in error:',err);document.getElementById('piUser').textContent='';setStatus(err.message==='App service rejected sign-in'||err.message==='No verified session token'?'serverError':'failed');}
 finally{btn.disabled=false;}
}
document.getElementById('piLogin').addEventListener('click',piSignIn);
