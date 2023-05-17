using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TilesApi.Models;

namespace TilesApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TilesItemsController : ControllerBase
    {
        private readonly TilesContext _context;

        public TilesItemsController(TilesContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TilesItem>>> GetTilesItems()
        {
          if (_context.TilesItems == null)
          {
              return NotFound();
          }
            return await _context.TilesItems.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TilesItem>> GetTilesItem(long id)
        {
          if (_context.TilesItems == null)
          {
            return NotFound();
          }
            var tilesItem = await _context.TilesItems.FindAsync(id);

            if (tilesItem == null)
            {
              return NotFound();
            }

            return tilesItem;
        }

        [HttpGet("n/{count}")]
        public async Task<ActionResult<IEnumerable<TilesItem>>> GetNItems(int count) {
          if (_context.TilesItems == null) {
            return NotFound();
          }
          return await _context.TilesItems.Take(count).ToListAsync();
        }

        [HttpGet("{id}/{count}")]
        public async Task<ActionResult<IEnumerable<TilesItem>>> GetNItemsFrom(long id, int count) {
          if (_context.TilesItems == null)
          {
            return NotFound();
          }
          var tilesItem = await _context.TilesItems.FindAsync(id);
          if (tilesItem == null)
          {
            return NotFound();
          }
          return await _context.TilesItems
            .Where(element => element.Id > id)
            .Take(count)
            .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TilesItem>> PostTilesItem(TilesItem tilesItem)
        {
          if (_context.TilesItems == null)
          {
              return Problem("Entity set 'TilesContext.TilesItems'  is null.");
          }
            _context.TilesItems.Add(tilesItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTilesItem), new { id = tilesItem.Id }, tilesItem);

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTilesItems()
        {
          if (_context.TilesItems == null)
          {
            return NotFound();
          }
          _context.ChangeTracker.Clear();
          await _context.SaveChangesAsync();
          return NoContent();
        }

        private bool TilesItemExists(long id)
        {
            return (_context.TilesItems?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
