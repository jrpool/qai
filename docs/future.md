# QAI: future enhancements

## Additional AI platforms and methods

### Devin/Windsurf/Cascade

**Platform**: Windsurf IDE (Cascade AI assistant) in Devin Desktop
**Method**: Remote HTTP MCP registration via config file
**Documentation**: `https://docs.devin.ai/desktop/cascade/mcp#remote-http-mcps`

**Configuration**: Add the following to `~/.codeium/windsurf/mcp_config.json`, creating the file if necessary:

```json
{
  "mcpServers": {
    "remote-http-mcp": {
      "serverUrl": "https://kilotest.com/mcp"
    }
  }
}
```

Here's the content to add below the heading — ready to paste:

```markdown
## Windsurf / Cascade

**Platform**: Windsurf IDE (Cascade AI assistant)
**Method**: Remote HTTP MCP registration via config file
**Documentation**: https://docs.devin.ai/desktop/cascade/mcp#remote-http-mcps

**Configuration**: Create `~/.codeium/windsurf/mcp_config.json` with:

```json
{
  "mcpServers": {
    "remote-http-mcp": {
      "serverUrl": "https://kilotest.com/mcp"
    }
  }
}
```

**Notes**:

- Windsurf hot-reloads this file; no IDE restart is required after creation or editing.
- Tools from the registered server appear in Cascade with an `mcp0_` prefix (not necessary for users to know).
- The config file at `~/.config/devin/config.json` applies to Devin AI only and has no effect on Windsurf/Cascade.
- This method requires file system access, making it less suitable for non-technical users than the UI-based registration offered by `Claude Desktop`, `claude.ai`, and `Perplexity Pro`.
- This platform is used by developers, not general users.
