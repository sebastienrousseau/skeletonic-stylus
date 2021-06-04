/**
 *  Copyright (c) Sebastien Rousseau 2021. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for more information.
*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
