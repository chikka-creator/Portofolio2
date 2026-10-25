ture, uv, 2.5);

      // Subtle frosted glass diffusion and rim lighting
      float rim = clamp(dot(vUv - 0.5, -uSunDirection) * 1.2 + 0.5, 0.0, 1.0);
      c.rgb = mix(c.rgb, vec3(0.12, 0.12, 0.14), 0.22);
      c.rgb += vec3(0.04) * rim;
      color = c;
    }

    float reveal = clamp(uRevealProgress, 0.0, 1.0);
    vec2 revealSize = vec2(reveal);
    float baseRadius = 0.05;
    float radius = baseRadius * reveal;

    // Soft rounded card borders via signed distance field
    float sdf = roundedRectSDF(vUv, revealSize, radius);
    float edge = 0.002;
    float alpha = 1.0 - smoothstep(0.0, edge, sdf);
    alpha *= smoothstep(0.1, 1.0, uRevealProgress);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(color.rgb, color.a * alpha);
  }
`,Np={__name:"ThreeBackground",props:{cards:{type:Array,required:!0,default:()=>[]},active:{type:Boolean,default:!0},isProjectOpen:{type:Boolean,default:!1}},emits:["hoverCard","selectCard"],setup(i,{expose:e,emit:t}){const{sunData:n}=Xo(),{playRatchet:r}=uo(),s=fr("isMenuOpen",()=>!1),a=fr("hasEntered",()=>!1),o=fr("spiralScrollOffset",()=>0),l=i,c=t,u=Ct(null);let d=null,f=null,m=null,g=null,M=null,p=1,h=so,A=io,y=ro,T=1,F=0,w=0,R=o.value||0,I=a.value?.6:1;const E=new ze(-9999,-9999),x=new Pp,P=new z,$=new ze(0,1),H=new ze(0,1);let G=null;const j=[];let k=null,ee=null;const V=new Map;let ce=!1;function de(S="#222222"){const _=document.createElement("canvas");_.width=256,_.height=256;const U=_.getContext("2d");U.fillStyle=S,U.fillRect(0,0,256,256);const B=new Ap(_);return B.needsUpdate=!0,B}function pe(){if(!u.value)return;const S=window.innerWidth,_=window.innerHeight;d=new yp({canvas:u.value,antialias:S>640,alpha:!0,powerPreference:"high-performance"}),d.setSize(S,_),d.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<=640?1.5:1.6)),f=new Tp,m=new Pt(35,S/_,.1,100),m.position.set(0,0,8),m.lookAt(0,0,0),M=new Cp,M.crossOrigin="anonymous",k=de("#151515"),Ne(),window.addEventListener("resize",be);const U=u.value;U.addEventListener("wheel",q,{passive:!0}),U.addEventListener("click",Q),U.addEventListener("touchstart",Fe,{passive:!0}),U.addEventListener("touchmove",$e,{passive:!0}),U.addEventListener("touchend",b,{passive:!0}),window.addEventListener("pointermove",te)}function Ne(){if(!f)return;j.forEach(Y=>{f.remove(Y),Y.material.dispose()}),j.length=0,G=null,De=!1,Oe=null,u.value&&(u.value.style.cursor=""),c("hoverCard",null);const S=l.cards;if(!S||S.length===0)return;const U=Math.max(1,Math.ceil(16/S.length)),B=S.length*U;ee||(ee=new Ni(1,1,8,1));for(let Y=0;Y<B;Y++){const W=S[Y%S.length],_e={uTexture:{value:k},uColorStrength:{value:0},uZoom:{value:1},uPlaneSizes:{value:new ze(ni,ii)},uImageSizes:{value:new ze(16,9)},uRevealProgress:{value:1},uScrollSpeed:{value:0},uSunDirection:{value:new ze(0,1)}},ne=new an({vertexShader:Up,fragmentShader:Ip,uniforms:_e,transparent:!0,side:Wt,depthWrite:!0});if(W.image)if(V.has(W.image)){const me=V.get(W.image);ne.uniforms.uTexture.value=me,me.image&&n