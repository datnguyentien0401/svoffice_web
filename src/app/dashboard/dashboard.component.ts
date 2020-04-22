import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {TdMediaService} from '@covalent/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from '../_services/api.service';
import {DatePipe} from '@angular/common';
import {JsogService} from 'jsog-typescript';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  times: any;
  multi: any;
  // Timeframe
  dateFrom: Date = new Date(new Date().getTime() - (2 * 60 * 60 * 24 * 1000));
  dateTo: Date = new Date(new Date().getTime() - (1 * 60 * 60 * 24 * 1000));
  imgs: any;

  constructor(// public media: TdMediaService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    // private changeDetectorRef: ChangeDetectorRef,
    private apiService: ApiService,
    private JSOG: JsogService) {
  }

  ngAfterViewInit(): void {
    // this.media.broadcast();
    // this.changeDetectorRef.detectChanges();
    // this.apiService.get('/files/get-urls', null).subscribe(data => {
    //   this.imgs = data;
    //   console.log(this.imgs);
    // });
    // setTimeout(() => {
    //   this.apiService.get('/fake/times', null)
    //     .subscribe(data => {
    //       this.times = data;
    //     });
    //   this.apiService.get('/fake/multi', null).subscribe(data => {
    //     this.multi = data;
    //   });
    // }, 1000);

  }

  // changeColInUri(data, colfrom, colto) {
  //   // const img = document.createElement('img');
  //   // img.src = data;
  //   // img.style.visibility = 'hidden';
  //   // document.body.appendChild(img);
  //   const img = new Image();
  //   img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAADeCAIAAADdBSngAAADFUlEQVR42u3dQXLCQAxFwbn/PTgnHMJ49CX1qyxTgZj2RsXI5ytFdlwCoSmhKTQlNIWmhKaEptCU0BSaEpoSmkJTQlNoSmgKTQlNCU2hKaEpNCU0JTSFpoSm0JTQFJoSmhKaQlNCU2hKaEr1ND8n7ufhm3/4b867SmiiiSaaaKKJJppoookmmmiiiSaaf6bZ5dUD74F5nxGaaKKJJppoookmmmiiiSaaaKKJ5o3ZXpfBZOurhCaaaKKJJppoookmmmiiiSaaaKK5lOYbb37JVUITTTTRRBNNNNFEE0000UQTTTTRXErzmlc00UQTTTTRRBNNNNFEE0000UQTTTTXnRXsggNNNNFEE0000UQTTTTRRBNNNL26q5RFM3BLeetppV3uaKKJJppoookmmmiiiSaaaKKJZleaXapdxyU00UQTTTTRRBNNNNFEE000heZSmtdmkK0HqLUnP9FEE0000UQTTTTRRBNNNNFEE000s+aanvkXdczSl+LQRBNNNNFEE0000UQTTTTRRBPNLJq198C1jydwfGuuiSaaaKKJJppoookmmmiiiSaaaHadawaO3AKfujfimX9oookmmmiiiSaaaKKJJppoookmmm8qXCJ73rfv0EQTTTTRRBNNNNFEE0000UQTTTS7tmRLlrkmmmiiiSaaaKKJJppoCk000UQzi2brFetv/Gbt1vfgs5doookmmmiiiSaaaKKJJppoookmmsFjvHnruNBEE0000UQTTTTRRBNNNNFEE000R9Gcd6qwdm27Xe5oookmmmiiiSaaaKKJJppoookmmimL0+duyUITTTTRRBNNNNFEE0000UQTTTTRRDPy+OI1mr4UhyaaaKKJJppoookmmmiiiSaaaDagGXhj1HL3IEA00UQTTTTRRBNNNNFEE0000URzKc0uu9wDp6q1fxNNNNFEE0000UQTTTTRRBNNNNFEUyoJTaEpoSk0JTSFpoSmhKbQlNAUmhKaEppCU0JTaEpoCk0JTQlNoSmhKTQlNCU0haaEptCU0BSaEpoSmkJTQlNoSmhKaKpNPzQVFJuvk0K+AAAAAElFTkSuQmCC';
  //   img.onload = function () {
  //   };
  //   const canvas = document.createElement('canvas');
  //   canvas.width = img.offsetWidth ? img.offsetWidth : (img.width ? img.width : 222);
  //   canvas.height = img.offsetHeight ? img.offsetHeight : (img.height ? img.height : 222);
  //   const ctx = canvas.getContext('2d');
  //   ctx.drawImage(img, 0, 0);
  //   img.parentNode.removeChild(img);
  //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   const imageDataData = imageData.data;
  //   const rgbfrom = this.hexToRGB(colfrom);
  //   const rgbto = this.hexToRGB(colto);
  //   console.log('rgbfrom', rgbfrom, 'rgbto', rgbto);
  //   for (let x = 0, len = imageDataData.length; x < len; x += 4) {
  //     const r = imageDataData[x];
  //     const g = imageDataData[x + 1];
  //     const b = imageDataData[x + 2];
  //     const a = imageDataData[x + 3];
  //     // console.log(imageDataData[x], imageDataData[x + 1], imageDataData[x + 2], imageDataData[x + 3], rgbfrom);
  //     if ((r === rgbfrom.r) && (g === rgbfrom.g) &&
  //       (b === rgbfrom.b) && (a === rgbfrom.a)
  //     ) {
  //       imageDataData[x] = rgbto.r;
  //       imageDataData[x + 1] = rgbto.g;
  //       imageDataData[x + 2] = rgbto.b;
  //       imageDataData[x + 3] = rgbto.a;
  //     }
  //   }
  //   console.log(imageData);
  //   ctx.putImageData(imageData, 0, 0);
  //   console.log(canvas.toDataURL());
  //   return canvas.toDataURL();
  // }
  //
  // hexToRGB(hexStr) {
  //   const col = {};
  //   col.r = parseInt(hexStr.substr(1, 2), 16);
  //   col.g = parseInt(hexStr.substr(3, 2), 16);
  //   col.b = parseInt(hexStr.substr(5, 2), 16);
  //   col.a = parseInt(hexStr.substr(7, 2), 16);
  //   return col;
  // }
  //
  // getFullImageUrl(relativeUrl: string) {
  //   return this.apiService.getFullUrl(relativeUrl);
  // }

  axisDate(val: string): string {
    return new DatePipe('en').transform(val, 'hh a');
  }

  ngOnInit(): void {
    // const img = document.getElementById('target');
    // document.getElementById('target').src = this.changeColInUri(img.src, 'x00000000', 'xABCE01FF');
  }
}
