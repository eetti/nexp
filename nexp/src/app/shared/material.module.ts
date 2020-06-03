import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    imports: [MatIconModule, MatButtonModule, MatSelectModule],
    exports: [MatIconModule, MatButtonModule, MatSelectModule]
})
export class MaterialModule { }
