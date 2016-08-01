'use strict';

angular.module('ngShowcaseApp').controller('ctrl.tree.treeData', function ($scope, TreeData) {
  var vm = $scope.vm = {};

  vm.countries = [
    {
      label: '�й�',
      flag: 'cn.png',
      items: [
        {
          label: '����',
          items: [
            {
              label: '������'
            },
            {
              label: '������'
            },
            {
              label: '������'
            }
          ]
        },
        {
          label: '�ӱ�',
          items: [
            {
              label: 'ʯ��ׯ'
            },
            {
              label: '�е�'
            },
            {
              label: '��ɽ'
            }
          ]
        }
      ]
    },
    {
      label: '����',
      flag: 'us.png',
      items: [
        {
          label: 'ŦԼ',
          items: [
            {
              label: '��������'
            },
            {
              label: '�ʺ���'
            }
          ]
        },
        {
          label: '�¿���˹��',
          items: [
            {
              label: '��˹��'
            },
            {
              label: '����˹'
            }
          ]
        },
        {
          label: '������������'
        }
      ]
    }
  ];
  vm.tree = new TreeData(vm.countries);
});
