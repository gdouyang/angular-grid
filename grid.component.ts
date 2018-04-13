import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { HttpService } from '../../services/http.service';
/**
 * 表格属性参数
 */
export class GridOption {
  /** url */
  url: string;
  /** 列
   * {
   * "label":""
   * "key":""
   * "type":""
   * "styleClass":""
   * "renderComponent":""
   * "onComponentInitFunction":""
   * "buttons":""
   * }
   * */
  colums: Array<any>;
  /**
   * 文字对齐方向
   * text-center, text-left
   */
  textAlign = 'text-center';
  /**
   * 表格查询参数,设置后会把参数传给后台
   */
  queryParams: Object;
  /**
   * 表格属性参数
   */
  constructor(url?: string) {
    this.url = url;
  }
}
/**
 * 表格栏位
 */
export class GridColum {
  label: string;
  key: string;
  /** custom(自定义显示组件),'' */
  type = '';
  styleClass: string;
  renderComponent: any;
  onComponentInitFunction: Function;
  buttons: Array<ColumButton>;

  /**
   * GridColum, renderComponent, onComponentInitFunction
   * @param label 标签
   * @param key bean字段
   * @param buttons 按钮
   */
  constructor(label: string, key?: string, buttons?: Array<ColumButton>) {
    this.label = label;
    this.key = key;
    this.buttons = buttons;
  }
}
/**
 * 单元格内容按钮
 */
export class ColumButton {
  label: string;
  /**
   * button, link
   */
  type = 'button';
  buttonClass = '';
  /** 权限码 */
  permitCode = '';
  clickMethod: Function;
  /** 按钮是否显示 return true显示, return false不显示 */
  display: Function;

  constructor(label: string, buttonClass?: string, clickMethod?: Function, type?: string, permitCode?: string) {
    this.label = label;
    this.buttonClass = buttonClass;
    this.clickMethod = clickMethod;
  }
  canDisplay(rowData: any) {
    if (this.display) {
      return this.display(rowData);
    } else {
      return true;
    }
  }
}
/**
 * 单元格组件
 */
@Component({
  selector: 'app-table-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngSwitch]="colum.type">
        <app-custom-view-component *ngSwitchCase="'custom'"
           [colum]="colum" [rowData]="rowData" class="{{colum.styleClass}}">
        </app-custom-view-component>
        <div *ngSwitchDefault class="{{colum.styleClass}}">{{ rowData[colum.key] }}</div>
    </div>
    `,
})
export class ViewColumComponent {

  @Input() colum: GridColum;
  @Input() rowData: any;
}
/**
 * 表格组件
 */
@Component({
  selector: 'app-grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() option: GridOption;
  @Output() onCreated = new EventEmitter();

  showLoading: boolean;
  datas: Array<any>;
  /**
   * 当前页码
   */
  page = 1;
  /**
   * 每页显示数
   * @memberof GridComponent
   */
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  /** 总页数 */
  collectionSize = 0;

  ngOnInit() {
    this.loadDatas();
    this.onCreated.emit(this);
  }

  constructor(
    private sanitizer: DomSanitizer,
    private httpService: HttpService
  ) { }

  trustedHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /** 加载数据 */
  loadDatas() {
    // debugger
    this.showLoading = true;
    const param = {
      'page': this.page,
      'pageSize': this.pageSize,
      'condition': this.option.queryParams
    };
    if (param.condition) {
      // tslint:disable-next-line:forin
      for (const key in param.condition) {
        const value = param.condition[key];
        if (typeof value === 'string') {
          param.condition[key] = value.trim();
        }
      }
    }
    this.httpService.post(this.option.url, param)
      // this.httpService.get(this.option.url + '?' + JSON.stringify(param))
      .then(data => {
        this.showLoading = false;
        this.datas = data.result.list;
        let size = 0;
        if (null != this.datas) {
          size = this.datas.length;
        }
        this.collectionSize = data.result.total;
      }
      );
  }
}


