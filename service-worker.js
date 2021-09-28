self.addEventListener("fetch",(e) => {
 if (e.request.url === "/?r=g") {
	e.respondWith(new Promise((res,rej) => { 
   res(new Response("Herh",{status: 200}));
 }));
 }
});
