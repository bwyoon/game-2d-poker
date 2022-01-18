
/*
 1990년 서울대 핵물리 실험실에 있을때 재미로 만들었던 2차원 포커 게임을 html+css+javascript로 20여년만에 다시 만들어 보았습니다.
 최근 한국의 정치 경제 이슈들을 게임에 아주 살짝 담아 보았습니다.
 거부감 있으신 분들은 그냥 게임을 하지 마시거나 아니면 이 소스코드 (html+css+javascript) 를 수정해서 게임 내용을 바꿔 즐기세요.
 이 게임을 배포, 수정, 및 수정 후 재배포 등등 제 3자의 이 게임에 관련된 모든 행위를 
 게임의 자바 스크립트 상단에 있는 이 코멘트는 지우지 않고 원작자가 윤복원 (Bokwon Yoon)이라고 명시하는 조건에서 허락합니다.
 남이 만든 거 살짝 바꿔서 자기가 만든 것처럼 하는 사람들이 꼭 있더라구요. 
 (자바 가나다 자기가 만들었다고 하시는 분들 다들 아시죠? 책까지 냈던데.)
 짧은 시간에 만들다 보니 버그가 꽤 있을 듯 한데, 혹시 버그를 찾으시면 bwyoon@gmail.com 으로 리포트해 주세요.

 2011년 연말에 윤복원 씀.


 This 2D Poker game is developed by Bokwon Yoon using html+css+javascript.
 Any modification of the code, distribution of the game, redistribution after modification of the code are granted
 only when you keep this original comment without being altered and you specify that the original work of this game is done by Bokwon Yoon.
 If you find any bug, please report it to me at bwyoon@gmail.com 

 (c) Bokwon Yoon 1990 (DOS version), 2011 - (html+css+javascript version)   
 
*/

var scalefactor = 10000;

var cardnum = new Array(52);
var carddeck = new Array(52);
var cardarray = new Array(25);
var hands = new Array(12);
var handcount = new Array(12);
var deckpos;
var deckcardhideox;
var asset;
var totalearning;
var initializingox;
var flyingox;


function formatCurrency(num) {
num = num.toString().replace(/\$|\,/g,'');
 if(isNaN(num)) num = "0";
 sign = (num == (num = Math.abs(num)));
 num = Math.floor(num*100+0.50000000001);
 cents = num%100;
 num = Math.floor(num/100).toString();
 if(cents<10)  cents = "0" + cents;
 for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
 num = num.substring(0,num.length-(4*i+3))+','+
 num.substring(num.length-(4*i+3));
 return (((sign)?'':'-') + '$' + num); // + '.' + cents);
}

function CardDraw(obj, cardnum)
{
 obj.style.backgroundColor="#fff";
 var q = Math.floor(cardnum/13);
 var m = cardnum%13+1;
 var num, sym; 

 obj.style.color = ((q == 0) || (q == 1)) ? "#000" : "#f00";
 num = (m==1)? "A" : (m==11)? "J" : (m==12)? "Q" : (m==13)? "K" : m;
 sym = (q==0)? "&spades;" : (q==1)? "&clubs;" : (q==2)? "&hearts;" : "&diams;";
 obj.innerHTML = num+"<br />"+sym;
}

function ShowCard(x, y)
{
 var obj=document.getElementById("card"+x+""+y);
 var cardnum = cardarray[x*5+y];

 if (obj != null) {
  if (cardnum < 0) {
   obj.style.backgroundColor="#aaa";
   obj.innerHTML = "";
  } else {
   CardDraw(obj, cardnum);
  }
 }
}

function ShowDeckCard()
{
 var obj=document.getElementById("deck");
 var cardnum=carddeck[deckpos];
 if (cardnum < 0 || deckcardhideox) {
  obj.style.backgroundColor="#aaa";
  obj.innerHTML = "";
 } else {
   CardDraw(obj, cardnum);
 }
}

function SetFlyingCard(cardnum)
{
 var obj=document.getElementById("flyingcard");
 if (cardnum < 0 || deckcardhideox) {
  obj.style.backgroundColor="#aaa";
  obj.innerHTML = "";
 } else {
   CardDraw(obj, cardnum);
 }
}

function ShowFlyingCard()
{
 var obj=document.getElementById("flyingcard");

 obj.style.left = "10px";
 obj.style.top = "10px";

 obj.style.zIndex = 1;
 obj.style.display = "block";
}

function HideFlyingCard()
{
 var obj=document.getElementById("flyingcard");
 obj.style.zIndex = -1;
 obj.style.display = "none";
}

function AnimateFlyingCard(x1, y1, x2, y2, cardnum, count)
{
 var xx1 = x1*50+10;
 var yy1 = y1*50+60;
 var xx2 = x2*50+10;
 var yy2 = y2*50+60;
 var x, y;
 
 flyingox = true;
 SetFlyingCard(cardnum);
 ShowFlyingCard();

 $('#flyingcard').css("left", "10px");
 $('#flyingcard').css("top", "10px");

 $('#flyingcard').animate
 (
  {left:xx2+'px', top: yy2+'px'}, 
  500, 
  function() 
  {
   HideFlyingCard();
   ShowCard(x2,y2);
   flyingox = false;

   if (deckpos == 25) {
    ResultDialog();
   } else {
    if (asset <= 0) {
     initializingox = false;
     GetMoneyDialog();
    }
   }   
  }
 )
}

function FirstFiveAnimateFlyingCard(count)
{
 var cardnum, c, x, y, xx, yy;

 if (count <= 5) {

  flyingox = true;

  cardnum = carddeck[deckpos++];
  SetFlyingCard(cardnum);
  ShowFlyingCard();
  ShowDeckCard();

  AssetChange(-scalefactor);

  do {
   c = Math.floor(Math.random()*25);
  } while (cardarray[c] >= 0);
  x = Math.floor(c/5);
  y = c%5;

  xx = x*50+10;
  yy = y*50+60;

  $('#flyingcard').css("left", "10px");
  $('#flyingcard').css("top", "10px"); 

  $('#flyingcard').animate
  (
   {left:xx+'px', top: yy+'px'}, 
   500, 
   function() 
   {
    HideFlyingCard();
    cardarray[5*x+y] = cardnum;
    ShowCard(x,y);
    if (count == 5) flyingox = false;
    else FirstFiveAnimateFlyingCard(count+1);
   }
  )

 }

}


function Shuffle()
{
 var n, m, c;

 for (n = 0; n < 52; n++) cardnum[n]=n;

 for (n = 0; n < 52; n++) {
  c = Math.floor(Math.random()*(52-n));
  carddeck[n] = cardnum[c];
  for (m = c+1; m < (52-n); m++) cardnum[m-1] = cardnum[m];
 }
}

function CheckHand(ca)
{
 var n, m, l;
 var straightox, flushox, sfox, rsfox;
 var suit = new Array(5);
 var rank = new Array(5);
 var sort = new Array(5);
 var paircount, pairoxsum;
 var allox;

 allox = true;
 for (n = 0; n < 5; n++) {
  if (ca[n] < 0) {
   allox = false;
  } else {
   suit[n] = Math.floor(ca[n]/13);
   rank[n] = ca[n]%13+1;
  }
 }

 // check pair
 paircount = 0;
 for (n = 0; n < 4; n++) {
  if (ca[n] >= 0) {
   for (m = n+1; m < 5; m++) {
    if (ca[m] >= 0) {
     if (rank[n] == rank[m]) paircount++;
    }
   }
  }
 }

 if (paircount == 1) return "1P"; // one pair
 if (paircount == 2) return "2P"; // two pairs
 if (paircount == 3) return "3K"; // three of a kind
 if (paircount == 4) return "FH"; // full house
 if (paircount == 6) return "4K"; // four of a kind

 if (allox && (paircount == 0)) {
  flushox = ((suit[0] == suit[1]) && (suit[1] == suit[2]) && (suit[2] == suit[3]) && (suit[3] == suit[4]));

  for (n = 0; n < 5; n++) sort[n] = rank[n];
  for (n = 0; n < 4; n++) {
   for (m = n+1; m < 5; m++) {
    if (sort[m] < sort[n]) {
     tmp = sort[n];
     sort[n] = sort[m];
     sort[m] = tmp;
    }
   }
  }
  if ((sort[4]-sort[0]) == 4) straightox = true;
  if ((sort[0]==1) && (sort[1]==10)) straightox = true;
    
  sfox = false;
  rsfox = false;
  if (straightox && flushox) sfox = true;
  if (sfox && (sort[0]==1) && (sort[1]==10)) rsfox = true;

  if (rsfox) return "RSF";
  else if (sfox) return "SF";
  else if (straightox) return "Straight";
  else if (flushox) return "Flush";
 }

 
 suit = null;
 rank = null;
 sort = null;
 return "";
}

function SetEarning(n, v)
{
 var obj = document.getElementById("hand"+n+"");
 obj.innerHTML = v;
 hands[n] = v;
}


function UpdateHands(x, y)
{
 var ca = new Array(5);
 var n;

 handcount[y] += 1;
 if (handcount[y] > 1) {
  for (n = 0; n < 5; n++) ca[n] = cardarray[n*5+y];   
  SetEarning(y, CheckHand(ca));
 }
 handcount[x+5] += 1;
 if (handcount[x+5] > 1) {
  for (n = 0; n < 5; n++) ca[n] = cardarray[x*5+n];   
  SetEarning(x+5, CheckHand(ca));
 }
 if ((x+y) == 4) {
  handcount[10] += 1;
  if (handcount[10] > 1) {
   for (n = 0; n < 5; n++) ca[n] = cardarray[n*5+(4-n)];   
   SetEarning(10, CheckHand(ca));
  }
 }
 if (x == y) {
  handcount[11] += 1;
  if (handcount[11] > 1) {
   for (n = 0; n < 5; n++) ca[n] = cardarray[n*5+n];   
   SetEarning(11, CheckHand(ca));
  }
 }

 ca = null;
}

function InitGame()
{
 Shuffle();

 deckpos = 0;
 deckcardhideox = false;
 
 AssetChange(0);

 for (n = 0; n < 12; n++) {
  hands[n] = "";
  handcount[n] = 0;
  SetEarning(n, "");
 }

 for (n = 0; n < 25; n++) cardarray[n] = -1;
 ShowDeckCard();
 for (n = 0; n < 25; n++) ShowCard(Math.floor(n/5), n%5);

 if (asset <= 0) {
  initializingox = true;
  GetMoneyDialog();
 }

 if (asset > 0) {
  deckcardhideox = false;
  FirstFiveAnimateFlyingCard(1)
  ShowDeckCard();
  
 }

}

function GetIEVersion() {
 var rv = -1; 
 if (navigator.appName == 'Microsoft Internet Explorer') {
  var ua = navigator.userAgent;
  var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
  if (re.exec(ua) != null)
   rv = parseFloat(RegExp.$1);
 }
 return rv;
}


function StartGame()
{
 flyingox = false;

 if (localStorage["asset"] != null) asset = Math.floor(localStorage["asset"]);
 else asset = 0;

 var iev = GetIEVersion();
 if ((iev < 9) && (iev > 0)) {
  alert("인터넷 익스플로러는 버전 9 이상에서 잘 작동합니다.\nFirefox난 Chrome 브라우저를 권장합니다." );
 }
 InitGame();
}

function AssetChange(money)
{
 asset += money;
 document.getElementById("myasset").innerHTML = formatCurrency(asset);
 localStorage["asset"] = Math.floor(asset);
}

function ResultDialog()
{
 var obj=document.getElementById("result-dialog");
 var robj=document.getElementById("result-div");
 var count, earning;

 robj.innerHTML = "";

 count = 0;
 totalearning = 0;

 for (n = 0; n < 12; n++) if (hands[n] == "1P") count++;
 if (count > 0) {
  earning = 0*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "one pair : "+formatCurrency(0*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "2P") count++;
 if (count > 0) {
  earning = 1*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "two pairs : "+formatCurrency(1*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "3K") count++;
 if (count > 0) {
  earning = 2*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "three of a kind : "+formatCurrency(2*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "Straight") count++;
 if (count > 0) {
  earning = 3*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "straight : "+formatCurrency(3*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "Flush") count++;
 if (count > 0) {
  earning = 4*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "flush : "+formatCurrency(4*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "FH") count++;
 if (count > 0) {
  earning = 5*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "full house : "+formatCurrency(5*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "4K") count++;
 if (count > 0) {
  earning = 10*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "four of a kind : "+formatCurrency(10*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "SF") count++;
 if (count > 0) {
  earning = 20*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "straight flush : "+formatCurrency(20*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 count = 0;
 for (n = 0; n < 12; n++) if (hands[n] == "RSF") count++;
 if (count > 0) {
  earning = 50*scalefactor*count;
  totalearning += earning;
  robj.innerHTML += "royal straight flush : "+formatCurrency(50*scalefactor)+" &times; "+count+" = "+formatCurrency(earning)+"<br/>";
 }

 if (totalearning > 0) {
  if (totalearning > 25*scalefactor) {
   robj.innerHTML += "Bravo!!!";
  }
  robj.innerHTML += "<br />You won "+formatCurrency(totalearning)+".";
  robj.innerHTML += "<div id=\"result-go-doubleup\" onClick=\"ResultDialogGoDoubleUp()\" >Double up</div>"
  robj.innerHTML += "<div id=\"result-no-doubleup\" onClick=\"ResultDialogNoDoubleUp()\" >No double up</div>"
 } else {
  robj.innerHTML += "<br /> Please do your best!!!<br />";
  robj.innerHTML += "<div id=\"result-ok\" onClick=\"ResultDialogNoDoubleUp()\" >OK</div>"
 }

 obj.style.zIndex = 2;
 obj.style.display = "block";
}

function ResultDialogOK()
{
 var obj=document.getElementById("result-dialog");
 obj.style.zIndex = -1;
 obj.style.display = "none";

 AssetChange(totalearning);
 InitGame();
}

function ResultDialogNoDoubleUp()
{
 ResultDialogOK();
}

function ResultDialogGoDoubleUp()
{
 var obj=document.getElementById("result-dialog");
 obj.style.zIndex = -1;
 obj.style.display = "none";

 DoubleUpDialog();
}

function GetMoneyDialog()
{
 var obj=document.getElementById("getmoney-dialog");

 obj.style.zIndex = 2;
 obj.style.display = "block";
}

function GetMoneyDialogOK()
{
 var obj=document.getElementById("getmoney-dialog");
 var money, alreadydid;

 var mobj=document.getElementById("moneysource");
 alreadydid = false;
 if (mobj.value == "KJK Account") {
  if (localStorage["KJK Account"]) {
   if (localStorage["KJK Account"] == "Yes") {
    alert("No money in the source 1.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 13000000;
   localStorage["KJK Account"] = "Yes";
  }
 } else if (mobj.value == "Cmotech Capital Increse") {
  if (localStorage["Cmotech Capital Increse"]) {
   if (localStorage["Cmotech Capital Increse"] == "Yes") {
    alert("No money in the source 2.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 24000000;
   localStorage["KJK Account"] = "Yes";
  }
 } else if (mobj.value == "Dogok Dong") {
  if (localStorage["Dogok Dong"]) {
   if (localStorage["Dogok Dong"] == "Yes") {
    alert("No money in the source 3.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 23000000;
   localStorage["Dogok Dong"] = "Yes";
  }
 } else if (mobj.value == "Bank Secret Fund") {
  if (localStorage["Bank Secret Fund"]) {
   if (localStorage["Bank Secret Fund"] == "Yes") {
    alert("No money in the source 4.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 20000000;
   localStorage["Bank Secret Fund"] = "Yes";
  }
 } else if (mobj.value == "Arms Lobbist Money") {
  if (localStorage["Arms Lobbist Money"]) {
   if (localStorage["Arms Lobbist Money"] == "Yes") {
    alert("No money in the source 5.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 10000000;
   localStorage["Arms Lobbist Money"] = "Yes";
  }
 } else if (mobj.value == "Naegok Dong") {
  if (localStorage["Naegok Dong"]) {
   if (localStorage["Naegok Dong"] == "Yes") {
    alert("No money in the source 6.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 4600000;
   localStorage["Naegok Dong"] = "Yes";
  }
 } else if (mobj.value == "KOH Money") {
  if (localStorage["KOH Money"]) {
   if (localStorage["KOH Money"] == "Yes") {
    alert("No money in the source 7.\nPlease select other money source.");
    alreadydid = true;
   }
  } else {
   money = 2600000;
   localStorage["KOH Money"] = "Yes";
  }
 } else {
  money = 1000000;
 }

 if (!alreadydid) {
  obj.style.zIndex = -1;
  obj.style.display = "none";
  AssetChange(money);
  if (initializingox) InitGame();
 }
}

function DoubleUpDialog()
{
 var obj=document.getElementById("doubleup-dialog");

 document.getElementById("doubleup-earning").innerHTML = formatCurrency(totalearning)+"<br />";

 obj.style.zIndex = 3;
 obj.style.display = "block";
}

function DoubleUpDialogHiLo(opt)
{
 var obj=document.getElementById("doubleup-dialog");

 deckcardhideox = false;
 ShowDeckCard();
 var num = carddeck[deckpos]%13+1;
 
 if (opt == "Hi") {
  if (num > 7) totalearning *= 2;
  else if (num < 7) totalearning  = 0;
 } else {
  if (num < 7) totalearning *= 2;
  else if (num > 7) totalearning  = 0;
 }
 var str = (num == 7) ? "No change\n" : "You won.\n";

 document.getElementById("doubleup-earning").innerHTML = formatCurrency(totalearning)+"<br />";

 if (totalearning == 0) {
  alert("You lost.");
  obj.style.zIndex = -3;
  obj.style.display = "none";
  InitGame();
 } else {
  var res=confirm(str+"Double up?");
  if (!res) {
   AssetChange(totalearning);
   totalearning = 0;
   obj.style.zIndex = -3;
   obj.style.display = "none";
   InitGame();
  } else {
   deckpos++;
   deckcardhideox = true;
   ShowDeckCard(); 
  }
 }
 
}


function DoubleUpDialogOK()
{
 var obj=document.getElementById("doubleup-dialog");
 obj.style.zIndex = -3;
 obj.style.display = "none";

 AssetChange(totalearning);
}



function ClickCard(x,y)
{
 var n;
 var obj=document.getElementById("card"+x+""+y);
 if ((!flyingox) && (obj != null)) {
  if (asset > 0) {
   if (cardarray[5*x+y] < 0) {
    cardarray[5*x+y] = carddeck[deckpos];
    deckpos++;

    AnimateFlyingCard(0, -1, x, y, cardarray[5*x+y]);

    if (deckpos >= 25) deckcardhideox = true;
    // ShowCard(x,y);
    ShowDeckCard();
    AssetChange(-1*scalefactor);
    UpdateHands(x,y);

   }
  } else {
   GetMoneyDialog();
  }
 } 
}

