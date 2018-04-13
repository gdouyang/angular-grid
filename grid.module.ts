import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GridComponent, ViewColumComponent } from './grid.component';
import { CustomViewComponent, LinkViewComponent, PlayerDetailLinkComponent } from './custom-view.component';
import { AuthGuardModule } from '../../guard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        TranslateModule,
        AuthGuardModule
    ],
    entryComponents: [
        LinkViewComponent,
        PlayerDetailLinkComponent
    ],
    declarations: [
        GridComponent,
        CustomViewComponent,
        ViewColumComponent,
        LinkViewComponent,
        PlayerDetailLinkComponent
    ],
    exports: [
        GridComponent,
        CustomViewComponent,
        ViewColumComponent,
        LinkViewComponent,
        PlayerDetailLinkComponent
    ]
})
export class GridModule { }
