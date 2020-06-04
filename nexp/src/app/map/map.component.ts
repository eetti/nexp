import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DataService } from '../services/data/data.service';
import { TooltipPosition } from '@angular/material/tooltip';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  // templateUrl: './nigeria.svg',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public fill = 'rgb(0, 0, 0)';
  public positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  public defaultStrokeWidth : string = "0px";

  message: any;
  state: { id: string; name: string };
  mapData: { type: string; state: string; state_value: string };
  title: string = 'Map';

  customColor: string = '#feffff';

  constructor(private data: DataService, @Inject(DOCUMENT) document) { }

  ngOnInit(): void {
    let svg_main = document.getElementById('map');
    this.data.currentMessage.subscribe((message) => {
      try {
        // refresh svg
        let className = 'added';
        let classNameGroup = 'added_group';
        // remove child icons/map markers
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }

        // remove stroke
        var elementGroups = document.getElementsByClassName(classNameGroup);
        let counter = 0;
        while (elementGroups.length > counter) {
          let oldSvgGrp = elementGroups[counter];
          oldSvgGrp.setAttribute('stroke-width', this.defaultStrokeWidth);
          oldSvgGrp['style'].strokeWidth = this.defaultStrokeWidth;
          counter++;
        }


        this.message = message;
        if (this.message) {
          if (this.message.items_group.length > 0) {

            // loop through list
            this.message.items_group.forEach((data) => {
              if (!data.state_value && !data.type)
                return;
              this.mapData = data;

              
              let svg = document.getElementById(
                this.mapData.state_value + '-group'
              ); //Get svg element group
              // get center of state map
              let [x, y] = this.getBoundingBoxCenter(svg);
              let newElement;
              if (this.mapData.type === "SOG") {
                let imgUrl = 'assets/img/house_pinpoint.png';
                newElement = this.drawImgElement('image', className, imgUrl, '40', '40', x, y);

              } else {
                newElement = this.drawElement('rect', className, '5', '5', x, y);
              }
              // svg.appendChild(newElement);
              svg_main.appendChild(newElement);


              svg.setAttribute('class', classNameGroup);
              svg.style.stroke = '#fff';
              svg.style.strokeWidth = '3px';
            });
          }
        }
      } catch (error) {
        console.log("Error encountered: "+error);
      }

    });
  }

  public drawImgElement(
    type: string,
    cssClass: string,
    url: string,
    height: string,
    width: string,
    x: number,
    y: number
  ) {
    let svgimg = document.createElementNS('http://www.w3.org/2000/svg', type);
    svgimg.setAttribute('class', cssClass);
    svgimg.setAttributeNS(null, 'height', height);
    svgimg.setAttributeNS(null, 'width', width);
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
    svgimg.setAttributeNS(null, 'x', (x - (parseInt(height) / 2 + 5)).toString());
    svgimg.setAttributeNS(null, 'y', (y - parseInt(width) / 2).toString());
    svgimg.setAttributeNS(null, 'visibility', 'visible');

    return svgimg;
  }

  public drawElement(
    type: string,
    cssClass: string,
    height: string,
    width: string,
    x: string,
    y: string
  ) {
    let newElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    newElement.setAttribute('class', cssClass);
    newElement.setAttribute('width', height);
    newElement.setAttribute('height', width);
    newElement.setAttribute('rx', '5');
    newElement.setAttribute('x', x);
    newElement.setAttribute('y', y);
    newElement.style.stroke = '#fff'; //Set stroke colour
    newElement.style.strokeWidth = '1px'; //Set stroke width

    return newElement;
  }

  public getBoundingBoxCenter(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    // var element = selection.node();
    try {
      var element = selection.childNodes[0];
      // use the native SVG interface to get the bounding box
      var bbox = element.getBBox();
      // return the center of the bounding box
      return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    } catch (error) {
      console.log("Eroor occured when finding center: " + error);
    }
    return [0, 0];
  }

  public changeColor(color?: string) {
    if (color) {
      this.fill = color;
    } else {
      const r = Math.random() * 256;
      const g = Math.random() * 256;
      const b = Math.random() * 256;
      const newLocal = `rgb(${r}, ${g}, ${b})`;
      this.fill = newLocal;
    }
  }
}
