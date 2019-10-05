import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  chain,
} from '@angular-devkit/schematics';

import {
  addModuleImportToRootModule,
  getProjectFromWorkspace,
  WorkspaceProject,
  WorkspaceSchema,
  getWorkspace,
  getWorkspacePath
} from 'schematics-utilities';
import { normalize, join } from '@angular-devkit/core';

import { merge } from 'lodash';

const envTemplate = `
(function (window) {
  window.__env = window.__env || {
  };
}(this));
`;

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];

  options.path = join(normalize(project.root), 'src');

  return host;
}

export function addModule(options: any): Rule {
  return (host: Tree, _context: SchematicContext) => {
    // get the workspace config of the consuming project
    // i.e. angular.json file
    const workspace: WorkspaceSchema = getWorkspace(host);

    // identify the project config which is using our library
    // or default to the default project in consumer workspace
    const project: WorkspaceProject = getProjectFromWorkspace(
      workspace,
      options.project || workspace.defaultProject
    );

    if (!project) {
      throw new SchematicsException(`Invalid project name (${options.project})`);
    }

    // inject our module into the current main module of the selected project
    addModuleImportToRootModule(
      // tree to modify
      host,
      // Module name to insert
      'EnvModule',
      // project name for import statement
      '@rodrigowba/env',
      // project to be modified
      project
    );

    // return updated tree
    return host;
  };
}

export function addTemplate(options: any): Rule {
  return (host: Tree, _context: SchematicContext) => {
    // get the workspace config of the consuming project
    // i.e. angular.json file
    const workspace: WorkspaceSchema = getWorkspace(host);

    // identify the project config which is using our library
    // or default to the default project in consumer workspace
    const project: WorkspaceProject = getProjectFromWorkspace(
      workspace,
      options.project || workspace.defaultProject
    );

    const envPath = `${project.sourceRoot}/env.js`;

    if (!host.exists(envPath)) {
      host.create(envPath, envTemplate);
    }

    const gitIgnorePath = `${project.sourceRoot}/.gitignore`;

    if (!host.exists(gitIgnorePath)) {
      host.create(gitIgnorePath, 'env.js\n');
    } else {
      let gitIgnoreContent = (host.read(gitIgnorePath) || '').toString();

      if (gitIgnoreContent.indexOf('env.js') === -1) {
        gitIgnoreContent += '\nenv.js\n';

        host.overwrite(gitIgnorePath, gitIgnoreContent);
      }
    }

    const indexPath = `${project.sourceRoot}/index.html`;

    if (host.exists(indexPath)) {
      let indexContent = (host.read(indexPath) || '').toString();

      const [headStart, headEnd] = [
        indexContent.indexOf('<head>'),
        indexContent.indexOf('</head>')
      ];

      if (headStart !== -1 && headEnd !== -1) {
        let headContent = indexContent.slice(headStart + 6, headEnd);

        if (headContent.indexOf('<script src="env.js"></script>') === -1) {
          headContent += '  <script src="env.js"></script>\n';

          indexContent = indexContent.slice(0, headStart + 6) + headContent + indexContent.slice(headEnd);

          host.overwrite(indexPath, indexContent);
        }
      }
    }

    return host;
  };
}

export function addConfig(options: any): Rule {
  return (host: Tree, _context: SchematicContext) => {
    // get the workspace config of the consuming project
    // i.e. angular.json file
    const workspacePath = getWorkspacePath(host);
    const workspace: WorkspaceSchema = getWorkspace(host);

    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];

    const updatedWorkspace = merge(
      workspace,
      {
        projects: {
          [options.project]: {
            architect: {
              build: {
                options: {
                  assets: [
                    `${project.sourceRoot}/env.js`
                  ]
                }
              },
              test: {
                options: {
                  assets: [
                    `${project.sourceRoot}/env.js`
                  ]
                }
              }
            }
          }
        }
      }
    ) as WorkspaceSchema;

    host.overwrite(workspacePath, JSON.stringify(updatedWorkspace, null, 2));

    return host;
  };
}

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);

    context.addTask(new NodePackageInstallTask());

    return chain([
      addModule(options),
      addTemplate(options),
      addConfig(options),
    ])(host, context);
  };
}
