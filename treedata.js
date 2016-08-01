'use strict';

angular.module('scHelper').factory('TreeData', function() {
  /**
   * �ܹ��Զ��������������������࣬�ӽڵ��б��������Ϊitems��ͬʱ���ڵ�ᱻ�����������ԣ�checked, folded, intermediate
   * @example
   * var data = new TreeData([
   *   {
   *     label: 'a',
   *     items: [
   *       {
   *         label: 'a1'
   *       },
   *       {
   *         label: 'a2'
   *       }
   *     ]
   *   },
     *   {
   *     label: 'b',
   *     items: [
   *       {
   *         label: 'b1'
   *       },
   *       {
   *         label: 'b2'
   *       }
   *     ]
   *   }
   * ]);
   * @param tree {Array.<Object>}
   * @param cbIsSame {function(Object, Object):boolean}
   * @constructor
   */
  function TreeData(tree, cbIsSame) {
    var _this = this;
    this.tree = tree;
    this.isSame = cbIsSame || function(item1, item2) { return item1 === item2 };
    /**
     * �۵�/չ��
     * @param item {Object}
     * @param folded
     * @private
     */
    this._fold = function(item, folded) {
      item.folded = folded;
    };
    /**
     * �۵�ָ���Ľڵ�
     * @param item {Object}
     */
    this.fold = function(item) {
      this._fold(item, true);
    };
    /**
     * չ��ָ���Ľڵ�
     * @param item {Object}
     */
    this.unfold = function(item) {
      this._fold(item, false);
    };
    /**
     * �л��ڵ���۵�״̬
     * @param item {Object}
     */
    this.toggleFold = function(item) {
      this._fold(item, !item.folded);
    };
    /**
     * ���ָ���ڵ���۵�״̬
     * @param item {Object}
     * @returns {boolean}
     */
    this.isFolded = function(item) {
      return item.folded;
    };
    /**
     * �ݹ���ָ���ڵ��Ƿ���ѡ��״̬���ӽڵ㣬����鵱ǰ�ڵ�״̬
     * @param item {Object} ��ʼ�ڵ�
     * @return {boolean}
     */
    this.hasCheckedChildren = function(item) {
      return !!_.find(item.items, function(subItem) {
        return subItem.checked || _this.hasCheckedChildren(subItem);
      });
    };
    /**
     * �ݹ���ָ���ڵ��Ƿ���δѡ��״̬���ӽڵ㣬����鵱ǰ�ڵ�״̬
     * @param item {Object} ��ʼ�ڵ�
     * @return {boolean}
     */
    this.hasUncheckedChildren = function(item) {
      return !!_.find(item.items, function(subItem) {
        return !subItem.checked || _this.hasUncheckedChildren(subItem);
      });
    };
    /**
     * ָ���ڵ��Ƿ��ѡ״̬��������鵱ǰ�ڵ㡣�������б�ѡ�е��ӽڵ㣬Ҳ��δѡ�е��ӽڵ�
     * @param item {Object} ��ʼ�ڵ�
     * @return {boolean}
     */
    this.hasSemiCheckedChildren = function(item) {
      return this.hasCheckedChildren(item) && this.hasUncheckedChildren(item);
    };
    /**
     * ��ǰ�ڵ��Ƿ��ѡ״̬��hasSemiCheckedChildren�ı���
     * @param item {Object}
     * @returns {boolean}
     */
    this.isSemiChecked = function(item) {
      return this.hasSemiCheckedChildren(item);
    };
    /**
     * ����item�ĸ����ڵ㣬���¼�����ǵ�checked��semiChecked״̬
     * @param items
     * @param item
     * @private
     */
    this._updateParents = function(items, item) {
      _.each(items, function(subItem) {
        if(_this.hasChildren(subItem, item)) {
          // ��Ҫ�ݹ�����Ӽ��������м�ڵ��״̬������Ȼ����ѡ��״̬����Ӱ�쵱ǰ�ڵ���ж�
          _this._updateParents(subItem.items, item);
          subItem.checked = _this.hasCheckedChildren(subItem);
          subItem.semiChecked = _this.isSemiChecked(subItem);
        }
      });
    };
    this.updateChecked = function(item) {
      this._updateParents(this.tree, item);
    };
    /**
     * ѡ��/��ѡָ���ڵ�
     * @param item {Object}
     * @param checked {boolean}
     * @private
     */
    this._check = function(item, checked) {
      item.checked = checked;
      // �ѵ�ǰ�ڵ��ѡ��״̬Ӧ�õ������¼�
      _.each(item.items, function(subItem) {
        _this._check(subItem, checked);
      });
      // �Զ����������ϼ���״̬
      this._updateParents(this.tree, item);
    };
    this._find = function(items, item) {
      if (!items)
        return null;
      // ���ӽڵ��в���
      for (var i = 0; i < items.length; ++i) {
        var subItem = items[i];
        // ����ҵ�����ֱ�ӷ���
        if (this.isSame(subItem, item))
          return subItem;
        // ����ݹ����
        var subResult = _this._find(subItem.items, item);
        if (subResult)
          return subResult;
      }
      return null;
    };
    /**
     * ����ָ���Ľڵ㣬��ʹ��cbIsSame����
     * @param item
     * @returns {Object}
     */
    this.find = function(item) {
      return this._find(this.tree, item);
    };
    /**
     * parent�����ӽڵ�����û��ָ����subItem�ڵ�
     * @param parent {Object}
     * @param subItem {Object|Array}
     * @returns {boolean}
     */
    this.hasChildren = function(parent, subItem) {
      var subItems = _.isArray(subItem) ? subItem : [subItem];
      return !!_.find(subItems, function(subItem) {
        return _this._find(parent.items, subItem);
      });
    };
    /**
     * ѡ�нڵ�
     * @param item {Object}
     * @param checked {boolean}
     */
    this.check = function(item, checked) {
      item = this.find(item);
      this._check(item, checked || angular.isUndefined(checked));
    };
    /**
     * ��ѡ�ڵ�
     * @param item {Object}
     */
    this.uncheck = function(item) {
      item = this.find(item);
      this._check(item, false);
    };
    /**
     * �л��ڵ��ѡ��״̬
     * @param item {Object}
     */
    this.toggleCheck = function(item) {
      item = this.find(item);
      this._check(item, !item.checked);
    };
    /**
     * ָ���ڵ��Ƿ�ѡ��
     * @param item {Object}
     * @returns {boolean}
     */
    this.isChecked = function(item) {
      item = this.find(item);
      return item.checked;
    };
  }
  return TreeData;
});
