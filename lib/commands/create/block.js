var Q = require('qq'),
    PATH = require('../../path'),
    bemUtil = require('../../util'),
    createLevel = require('../../level').createLevel,
    Context = require('../../context').Context,
    Tech = require('../../tech').Tech;

module.exports = function() {

    return this
        .title('Block.').helpful()
        .apply(bemUtil.chdirOptParse)
        .apply(bemUtil.techsOptParse)
        .apply(bemUtil.levelOptParse)
        .opt()
            .name('force').short('f').long('force')
            .title('force files creation')
            .flag()
            .end()
        .arg()
            .name('names')
            .title('blocks names')
            .req()
            .arr()
            .end()
        .act(function(opts, args) {
            var level = createLevel(opts.levelDir),
                context = new Context(level, opts),
                done;

            // FIXME: унести на уровень выше, например в обработку опций
            Tech.setContext(context);

            args.names.forEach(function(name) {
                var prefix = level.get('block', [name]);
                bemUtil.mkdirs(PATH.dirname(prefix));
                context.getDefaultTechs().forEach(function(t) {
                    done = Q.wait(done, context.getTech(t).create(prefix,
                        { args: args.raw || [], BlockName: name, Prefix: prefix }, opts.force));
                });
            });

            return done;
        });

};
