# Plugins
Which takes up the burden of synching, orchestration, aggregation of data and give it the way a user would like to view it 

### Installation
* Clone the repo<br/>
https://github.com/500apps2/pluginsly.git<br/><br/>
* Install dependencies<br/>
npm install
### _Build_
* Minify and pack the scripts<br/>
npm run build<br/>
### _Run_
* Run and test the application<br/>
npm start

### Client Integration
* Client will include this script tag in his application<br />
```sh
  <script>
      ((p,l,u,g,i,n,s)=>{
        i = l.getElementsByTagName('head')[0];
        n = l.createElement('script');
        n.async = 1;
        n.src = u+g;
        n.onload = ()=>{p._Plugins.init(/*API key*/'',/*user JSON*/{})};
        i.appendChild(n);})(window,document,'','pluginsly.js');
  </script>
```    
### Documentation
* https://docs.google.com/document/d/1AbhY1QFqsTWrbZhnHVBQDLf3DPRHK49axrif7-LFtWA/edit#