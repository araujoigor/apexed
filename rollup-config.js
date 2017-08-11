import nodeResolve  from "rollup-plugin-node-resolve";
import commonjs     from "rollup-plugin-commonjs";
import uglify       from "rollup-plugin-uglify";
import json         from "rollup-plugin-json"

const plugins = [
    nodeResolve({jsnext: true, module: true}),
    commonjs({
        include: ["node_modules/rxjs/**", "node_modules/ace-builds/**", "node_modules/sfid/**", "node_modules/simple-object-flatten/**"],
        extensions: [ '.js', '.json' ]
    }),
    json({
        include: 'node_modules/sfid/**',
    })
];

if (process.env.NODE_ENV === "production") { plugins.push(uglify()); }

export default {
    entry: "./gen/bundle/src/main.js",
    dest: "./app/build.gen.js", // output a single application bundle
    sourceMap: true,
    format: "iife",
    onwarn: function(warning) {
        // Skip certain warnings

        // should intercept ... but doesn"t in some rollup versions
        if ( warning.code === "THIS_IS_UNDEFINED" ) { return; }
        // intercepts in some rollup versions
        if ( warning.indexOf && warning.indexOf("The \"this\" keyword is equivalent to \"undefined\"") > -1 ) { return; }

        // console.warn everything else
        console.warn( warning.message );
    },
    plugins: plugins
}
