# Troubleshooting Guide

## Fixed Issues

### ✅ React Hooks Order Violation

**Error**: "React has detected a change in the order of Hooks"

**Cause**: Early return before `useEffect` hook in Geometry component

**Fix**: Moved all hooks before conditional returns

- All hooks now execute unconditionally
- Conditional logic moved after hooks
- Dependencies properly tracked

### ✅ Double Positioning

**Issue**: 3D nodes positioned incorrectly

**Cause**: ThreeDNodeRenderer was applying position twice

**Fix**: Removed position styles from ThreeDNodeRenderer

- Parent div in canvas.tsx handles positioning
- ThreeDNodeRenderer only handles size and transform

## Common Issues & Solutions

### 3D Node Not Showing

**Symptoms**: Node created but no 3D preview visible

**Checks**:

1. Is the node type "3d"? Check in nodes panel
2. Is SVG loaded? Check Geometry section
3. Check browser console for errors
4. Verify `/svgs/logo.svg` exists

**Solution**:

- Default logo should auto-load
- If not, manually upload an SVG
- Check network tab for failed logo fetch

### SVG Upload Not Working

**Symptoms**: Upload button doesn't respond

**Checks**:

1. Is file actually .svg format?
2. Check browser console for errors
3. Verify file size (should be reasonable)

**Solution**:

- Only .svg files are accepted
- Try drag & drop instead of click
- Check file permissions

### 3D Model Not Rendering

**Symptoms**: Node shows but model is blank/black

**Checks**:

1. Is SVG valid? Try opening in browser
2. Check for SVG parsing errors in console
3. Verify Three.js loaded (check network tab)

**Solution**:

- Simplify SVG (remove complex features)
- Remove text elements with special characters
- Try a different SVG file

### Performance Issues

**Symptoms**: Slow rendering, lag when interacting

**Checks**:

1. How many 3D nodes are on canvas?
2. Is bevel quality set too high?
3. Check browser performance tab

**Solution**:

- Limit 3D nodes to 3-5 per canvas
- Use lower bevel quality (1-4)
- Disable auto-rotate when not needed
- Close other browser tabs

### Auto-Rotate Not Working

**Symptoms**: Checkbox enabled but model doesn't rotate

**Checks**:

1. Is checkbox actually checked?
2. Is rotation speed > 0?
3. Check if OrbitControls loaded

**Solution**:

- Increase rotation speed slider
- Refresh the page
- Check console for Three.js errors

## Development Issues

### TypeScript Errors

**Issue**: Type errors in 3D components

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

### Module Not Found

**Issue**: Can't find @/components/threed

**Solution**:

- Verify file exists: `components/threed/index.ts`
- Check tsconfig.json paths
- Restart TypeScript server in IDE

### MobX Not Updating

**Issue**: Changes don't reflect in UI

**Solution**:

- Verify component wrapped with `observer()`
- Check MobX store is properly initialized
- Use `makeAutoObservable()` in stores

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues

- Safari: WebGL performance may be slower
- Firefox: Some post-processing effects may differ
- Mobile: Limited to simpler models

## Getting Help

### Debug Checklist

1. ✅ Check browser console for errors
2. ✅ Verify all dependencies installed
3. ✅ Check network tab for failed requests
4. ✅ Try with default logo first
5. ✅ Test with simple SVG
6. ✅ Clear browser cache
7. ✅ Restart dev server

### Useful Console Commands

```javascript
// Check if 3D store exists
window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;

// Get editor engine (in React DevTools)
$r.props.editorEngine;

// Check 3D state
editorEngine.threed.getModelState(nodeId);

// List all 3D nodes
editorEngine.nodes.nodes.filter((n) => n.type === "3d");
```

### Log Files

Check these for errors:

- Browser console (F12)
- Network tab (failed requests)
- React DevTools (component tree)
- MobX DevTools (state changes)

## Still Having Issues?

1. Check PHASE_2_COMPLETE.md for implementation details
2. Review component source code
3. Test with minimal example
4. Check if issue is reproducible
5. Document steps to reproduce
