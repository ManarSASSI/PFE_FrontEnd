import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Gallery, GalleryItem, GalleryModule, ImageItem, ImageSize, ThumbnailsPosition } from "ng-gallery";
import { Lightbox, LightboxModule } from "ng-gallery/lightbox";
import { SharedModule } from "../../../../shared/common/sharedmodule";
import { RouterModule } from "@angular/router";


interface widget1Type{
  id: number;
  title: string;
  data: string;
  caption: string;
  status: string;
  statusText: string;
  description: string;
  logo: string;
  logoStatus: string;
}

const widget1Data: widget1Type[]= [
  {id: 1, title: 'Page Views', data: '234k', caption: '43.2', status:'danger', statusText: 'caret-down', description: 'than last month', logo:'mdi-file-outline', logoStatus:'primary'},
  {id: 2, title: 'Time On Site', data: '12m 3s', caption: '19.8', status:'success', statusText: 'caret-up', description: 'than last month', logo:'mdi-clock', logoStatus:'warning'},
  {id: 3, title: 'Impressions', data: '168', caption: '0.8', status:'success', statusText: 'caret-up', description: 'than last month', logo:'mdi-heart-outline', logoStatus:'success'},
  {id: 4, title: 'Total Followers', data: '3456k', caption: '0.8', status:'success', statusText: 'caret-up', description: 'than last month', logo:'mdi-account-multiple-outline', logoStatus:'secondary'},
]

@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [SharedModule,GalleryModule,LightboxModule,RouterModule],
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetsComponent implements OnInit {
  widget1List!: widget1Type[];
  items!: GalleryItem[];

  imageData = data;
  constructor() { }

  ngOnInit(): void {
    this.widget1List = widget1Data
    // Creat gallery items
    this.items = this.imageData.map((item:any) => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
  }
}

const data = [
  {
    srcUrl: './assets/images/media/29.jpg',
    previewUrl: './assets/images/media/29.jpg'
  },
  {
    srcUrl: './assets/images/media/30.jpg',
    previewUrl: './assets/images/media/30.jpg'
  },
  {
    srcUrl: './assets/images/media/31.jpg',
    previewUrl: './assets/images/media/31.jpg'
  },
  {
    srcUrl: './assets/images/media/32.jpg',
    previewUrl: './assets/images/media/32.jpg'
  },
  {
    srcUrl: './assets/images/media/33.jpg',
    previewUrl: './assets/images/media/33.jpg'
  },
  {
    srcUrl: './assets/images/media/34.jpg',
    previewUrl: './assets/images/media/34.jpg'
  },
  {
    srcUrl: './assets/images/media/36.jpg',
    previewUrl: './assets/images/media/36.jpg'
  },
  {
    srcUrl: './assets/images/media/37.jpg',
    previewUrl: './assets/images/media/37.jpg'
  },
];