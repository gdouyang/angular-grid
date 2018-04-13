import {
  Component,
  Input,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { GridColum } from './grid.component';

@Component({
  selector: 'app-custom-view-component',
  template: `
      <ng-template #dynamicTarget></ng-template>
    `,
})
export class CustomViewComponent implements OnInit, OnDestroy {

  customComponent: any;
  @Input() colum: GridColum;
  @Input() rowData: any;

  @ViewChild('dynamicTarget', { read: ViewContainerRef }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (this.colum && !this.customComponent) {
      this.createCustomComponent();
      this.callOnComponentInit();
      this.patchInstance();
    }
  }

  ngOnDestroy() {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }

  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(this.colum.renderComponent);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected callOnComponentInit() {
    const onComponentInitFunction = this.colum.onComponentInitFunction;
    // tslint:disable-next-line:no-unused-expression
    onComponentInitFunction && onComponentInitFunction(this.customComponent.instance);
  }

  protected patchInstance() {
    Object.assign(this.customComponent.instance, this.getPatch());
  }

  protected getPatch() {
    return {
      key: this.colum.key,
      value: this.rowData[this.colum.key],
      rowData: this.rowData
    };
  }
}


/**
 * 自定义单元格内容a标签组件，把内容包上a标签支持点击事件
 * @event click
 */
@Component({
  selector: 'app-button-view',
  template: `
    <a href="javascript:void(0);" (click)="onClick()">{{ renderValue }}</a>
  `,
})
export class LinkViewComponent implements OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() click: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.value != null) {
      this.renderValue = this.value.toString();
    }
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}

/**
 * 自定义单元格内容a标签组件，把内容包上a标签支持点击事件
 * @event click
 */
@Component({
  selector: 'app-player-detail-view',
  template: `
    <a href="#/player/detail/{{renderValue}}">{{ renderValue }}</a>
  `,
})
export class PlayerDetailLinkComponent implements OnInit {
renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    if (this.value != null) {
      this.renderValue = this.value.toString();
    }
  }

}
