import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
    imports: [MatIconModule, MatButtonModule, MatSelectModule, MatTooltipModule],
    exports: [MatIconModule, MatButtonModule, MatSelectModule, MatTooltipModule]
})
export class MaterialModule { }
