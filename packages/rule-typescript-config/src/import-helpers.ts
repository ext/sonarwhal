/**
 * @fileoverview `typescript-config/import-helpers` checks if the property `importHelpers`
 * is enabled in the TypeScript configuration file (i.e `tsconfig.json`) to reduce the
 * output size.
 */
import * as path from 'path';

import { Category } from 'sonarwhal/dist/src/lib/enums/category';
import { RuleScope } from 'sonarwhal/dist/src/lib/enums/rulescope';
import { RuleContext } from 'sonarwhal/dist/src/lib/rule-context';
import { IRule, RuleMetadata, ScanEnd } from 'sonarwhal/dist/src/lib/types';
import { debug as d } from 'sonarwhal/dist/src/lib/utils/debug';
import * as misc from 'sonarwhal/dist/src/lib/utils/misc';

import { configChecker } from './helpers/config-checker';

const debug: debug.IDebugger = d(__filename);

/*
 * ------------------------------------------------------------------------------
 * Public
 * ------------------------------------------------------------------------------
 */

export default class TypeScriptConfigImportHelpers implements IRule {
    public static readonly meta: RuleMetadata = {
        docs: {
            category: Category.development,
            description: '`typescript-config/import-helpers` checks if the property `importHelpers` is enabled in the TypeScript configuration file (i.e `tsconfig.json`) to reduce the output size.'
        },
        id: 'typescript-config/import-helpers',
        schema: [],
        scope: RuleScope.local
    }

    public constructor(context: RuleContext) {
        const validate = configChecker('compilerOptions.importHelpers', true, 'The compiler option "importHelpers" should be enabled to reduce the output size.', context);

        const validateTslibInstalled = async (evt: ScanEnd): Promise<void> => {
            const { resource } = evt;

            const pathToTslib = path.join(process.cwd(), 'node_modules', 'tslib');

            debug(`Searching "tslib" in ${pathToTslib}`);

            try {
                misc.getPackage(pathToTslib);
                debug(`"tslib" found`);
            } catch (e) {
                debug(e);

                await context.report(resource, null, `Couldn't find package "tslib".`);
            }
        };

        context.on('parse::typescript-config::end', validate);
        context.on('scan::end', validateTslibInstalled);
    }
}
