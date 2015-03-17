import Ember from 'ember';

export default Ember.Component.extend({
    router: null,
    applicationController: null,

    handlerInfos: function () {
        return this.get('router').router.currentHandlerInfos;
    }.property('applicationController.currentPath'),

    pathNames: Ember.computed.mapBy('handlerInfos', 'name'),
    controllers: Ember.computed.mapBy('handlerInfos', 'handler.controller'),

    breadCrumbs: function () {
        var controllers = this.get('controllers'),
            defaultPaths = this.get('pathNames'),
            breadCrumbs = [];

        controllers.forEach(function (controller, index) {
            var crumbs = controller.get('breadCrumbs') || [];
            var singleCrumb = controller.get('breadCrumb');

            if (!Ember.isBlank(singleCrumb)) {
                crumbs.push({
                    label: singleCrumb,
                    path: controller.get('breadCrumbPath'),
                    model: controller.get('breadCrumbModel'),
                });
            }

            crumbs.forEach(function (crumb) {
                breadCrumbs.addObject(Ember.Object.create({
                    label: crumb.label,
                    path: crumb.path || defaultPaths[index],
                    model: crumb.model,
                    linkable: !Ember.isNone(crumb.linkable) ? crumb.linkable : true,
                    isCurrent: false
                }));
            });
        });

        var deepestCrumb = breadCrumbs.get('lastObject');
        if (deepestCrumb) {
            deepestCrumb.isCurrent = true;
        }

        return breadCrumbs;
    }.property(
        'controllers.@each.breadCrumbs',
        'controllers.@each.breadCrumb',
        'controllers.@each.breadCrumbPath',
        'controllers.@each.breadCrumbModel',
        'pathNames.[]')
});