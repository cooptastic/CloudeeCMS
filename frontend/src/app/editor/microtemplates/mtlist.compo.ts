/*
 * Copyright WebGate Consulting AG, 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */

import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { TabsNavService } from 'src/app/services/tabs.service';

@Component({
  selector: 'app-mtlist',
  templateUrl: './mtlist.compo.html'
})

export class MTListComponent implements OnInit {

  constructor(
    private tabsSVC: TabsNavService,
    private backendSVC: BackendService
  ) { }

  viewList: any = [];
  loading = true;
  tabID = 'tab-mtlist';

  ngOnInit() {
    const that = this;
    this.tabsSVC.addTabEvent(this.tabID, 'onTabFocus', () => {
      if (that.tabsSVC.isTabDataExpired(that.tabID)) { that.loadView(true); }
    });
    this.loadView(false);
  }

  loadView(forceUpdate: boolean) {
    const that = this;
    if (forceUpdate) { that.setLoading(true); }
    this.backendSVC.getAllMicroTemplates(forceUpdate).then(
      (data: any) => {
        that.viewList = data;
        that.setLoading(false);
        that.tabsSVC.setTabDataExpired(that.tabID, false); // mark data of tab as up to date
      },
      (err) => {
        that.tabsSVC.printNotification('Error while loading');
        console.log(err);
        that.setLoading(false);
      }
    );
  }

  btnNavigateTo(npath: string): void {
    this.tabsSVC.navigateTo(npath);
  }
  setLoading(on: boolean) {
    this.loading = on;
    this.tabsSVC.setLoading(on);
  }
}
